<?php

namespace App\Http\Controllers\Paquetes\FacturacionCobranza\CU10_GestionarPagoMensualidad;

use App\Http\Controllers\Controller;
use App\Models\Paquetes\FacturacionCobranza\CU09_GenerarMensualidades\MensualidadFacturacion;
use App\Models\Paquetes\FacturacionCobranza\CU10_GestionarPagoMensualidad\PagoMensualidad;
use App\Support\AuditLogger;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PagoMensualidadController extends Controller
{
    use ApiResponse;

    /**
     * CU10 - Registrar cobro / pago de mensualidad
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'mensualidad_id'     => 'required|exists:Mensualidad,idMensualidad',
            'monto_pagado'       => 'required|numeric|min:0.01',
            'metodo_pago'        => 'required|string|in:EFECTIVO,TRANSFERENCIA,QR,TARJETA',
            'numero_transaccion' => 'nullable|string|max:100',
            'observaciones'      => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $mensualidad = MensualidadFacturacion::lockForUpdate()->findOrFail($validated['mensualidad_id']);

            if ($mensualidad->estado_pago === 'PAGADO') {
                return $this->error('Esta mensualidad ya se encuentra pagada.', 422);
            }

            if ($mensualidad->estado_pago === 'ANULADO') {
                return $this->error('No se puede registrar el pago de una mensualidad anulada.', 422);
            }

            // Regla de negocio: el pago debe cubrir EXACTAMENTE el monto de la
            // mensualidad. El importe se calcula/valida en el backend.
            $esperado = round((float) $mensualidad->monto, 2);
            $recibido = round((float) $validated['monto_pagado'], 2);

            if (abs($esperado - $recibido) > 0.001) {
                return $this->error(
                    'El monto pagado debe ser igual al monto de la mensualidad (Bs '.number_format($esperado, 2).').',
                    422
                );
            }

            $pago = PagoMensualidad::create([
                'codigo_recibo'      => 'REC-' . date('Ymd') . '-' . strtoupper(Str::random(4)),
                'mensualidad_id'     => $mensualidad->id,
                'monto_pagado'       => $esperado,
                'metodo_pago'        => $validated['metodo_pago'],
                'numero_transaccion' => $validated['numero_transaccion'] ?? null,
                'fecha_pago'         => now(),
                'cajero_user_id'     => $request->user()->id,
                'observaciones'      => $validated['observaciones'] ?? null,
            ]);

            $mensualidad->update([
                'estado_pago' => 'PAGADO',
            ]);

            AuditLogger::log(
                'CU10',
                'REGISTRAR_PAGO',
                "Pago {$pago->codigo_recibo} registrado para la mensualidad {$mensualidad->codigo_factura}.",
                ['estado_pago' => 'PENDIENTE'],
                ['estado_pago' => 'PAGADO', 'monto_pagado' => $esperado, 'metodo_pago' => $validated['metodo_pago']]
            );

            return $this->success([
                'pago'        => $pago,
                'mensualidad' => $mensualidad,
            ], 'Pago de mensualidad registrado exitosamente.', 201);
        });
    }
}
