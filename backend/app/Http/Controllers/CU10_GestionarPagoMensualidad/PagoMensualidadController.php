<?php

namespace App\Http\Controllers\CU10_GestionarPagoMensualidad;

use App\Http\Controllers\Controller;
use App\Models\CU09_GenerarMensualidades\MensualidadFacturacion;
use App\Models\CU10_GestionarPagoMensualidad\PagoMensualidad;
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
            'mensualidad_id'     => 'required|exists:mensualidades,id',
            'monto_pagado'       => 'required|numeric|min:0.01',
            'metodo_pago'        => 'required|string|in:EFECTIVO,TRANSFERENCIA,QR,TARJETA',
            'numero_transaccion' => 'nullable|string|max:100',
            'observaciones'      => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated) {
            $mensualidad = MensualidadFacturacion::findOrFail($validated['mensualidad_id']);

            if ($mensualidad->estado_pago === 'PAGADO') {
                return $this->error('Esta mensualidad ya se encuentra pagada.', 422);
            }

            $pago = PagoMensualidad::create([
                'codigo_recibo'      => 'REC-' . date('Ymd') . '-' . strtoupper(Str::random(4)),
                'mensualidad_id'     => $mensualidad->id,
                'monto_pagado'       => $validated['monto_pagado'],
                'metodo_pago'        => $validated['metodo_pago'],
                'numero_transaccion' => $validated['numero_transaccion'] ?? null,
                'fecha_pago'         => now(),
                'cajero_user_id'     => auth()->id() ?? 1,
                'observaciones'      => $validated['observaciones'] ?? null,
            ]);

            $mensualidad->update([
                'estado_pago' => 'PAGADO',
            ]);

            return $this->success([
                'pago'        => $pago,
                'mensualidad' => $mensualidad,
            ], 'Pago de mensualidad registrado exitosamente.', 201);
        });
    }
}
