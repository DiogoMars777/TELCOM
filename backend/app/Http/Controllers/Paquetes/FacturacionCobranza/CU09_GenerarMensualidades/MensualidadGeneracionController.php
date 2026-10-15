<?php

namespace App\Http\Controllers\Paquetes\FacturacionCobranza\CU09_GenerarMensualidades;

use App\Http\Controllers\Controller;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\Paquetes\FacturacionCobranza\CU09_GenerarMensualidades\MensualidadFacturacion;
use App\Support\AuditLogger;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MensualidadGeneracionController extends Controller
{
    use ApiResponse;

    /**
     * CU09 - Listar mensualidades generadas
     */
    public function index(Request $request): JsonResponse
    {
        $periodo = $request->input('periodo', now()->format('Y-m'));

        $mensualidades = MensualidadFacturacion::with(['cliente', 'servicio.asignacionPlanActual.plan'])
            ->where('periodo', $periodo)
            ->latest('idMensualidad')
            ->paginate(20);

        return $this->success($mensualidades, "Mensualidades del período {$periodo} obtenidas.");
    }

    /**
     * CU09 - Generación masiva o individual de mensualidades del período
     */
    public function generar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'periodo' => 'required|date_format:Y-m',
        ]);

        $periodo = $validated['periodo'];
        $serviciosActivos = ServicioInternet::with(['asignacionPlanActual.plan'])
            ->where('estado_servicio', 'ACTIVO')
            ->get();
        $generadas = 0;

        DB::transaction(function () use ($serviciosActivos, $periodo, &$generadas) {
            foreach ($serviciosActivos as $servicio) {
                // Determinar el monto exacto del plan contratado
                $tarifa = $servicio->precio_mensual
                    ?? $servicio->asignacionPlanActual?->precioAplicado
                    ?? $servicio->asignacionPlanActual?->plan?->precioMensual;

                if ($tarifa === null || (float)$tarifa <= 0) {
                    $tarifa = 150.00;
                }

                // Evitar duplicados para el mismo período. Se bloquea la fila existente
                $existente = MensualidadFacturacion::where('servicio_id', $servicio->id)
                    ->where('periodo', $periodo)
                    ->lockForUpdate()
                    ->first();

                if ($existente) {
                    // Si ya existía pero con monto nulo o 0, actualizar con la tarifa real
                    if ($existente->monto === null || (float)$existente->monto <= 0) {
                        $existente->update(['monto' => $tarifa]);
                        $generadas++;
                    }
                    continue;
                }

                $fechaVencimiento = Carbon::createFromFormat('Y-m', $periodo)
                    ->setDay(min($servicio->dia_corte, 28));

                MensualidadFacturacion::create([
                    'codigo_factura'    => 'FAC-' . $periodo . '-' . strtoupper(Str::random(4)),
                    'cliente_id'        => $servicio->cliente_id,
                    'servicio_id'       => $servicio->id,
                    'periodo'           => $periodo,
                    'monto'             => $tarifa,
                    'fecha_emision'     => now(),
                    'fecha_vencimiento' => $fechaVencimiento,
                    'estado_pago'       => 'PENDIENTE',
                ]);
                $generadas++;
            }
        });

        AuditLogger::log('CU09', 'GENERAR_MENSUALIDADES', "Se generaron {$generadas} mensualidades para el período {$periodo}.", null, [
            'periodo' => $periodo, 'generadas' => $generadas,
        ]);

        return $this->success([
            'periodo'   => $periodo,
            'generadas' => $generadas,
        ], "Se generaron exitosamente {$generadas} mensualidades para el período {$periodo}.");
    }
}
