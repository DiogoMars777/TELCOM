<?php

namespace App\Http\Controllers\CU09_GenerarMensualidades;

use App\Http\Controllers\Controller;
use App\Models\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\CU09_GenerarMensualidades\MensualidadFacturacion;
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

        $mensualidades = MensualidadFacturacion::with(['cliente', 'servicio'])
            ->where('periodo', $periodo)
            ->latest()
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
        $serviciosActivos = ServicioInternet::where('estado_servicio', 'ACTIVO')->get();
        $generadas = 0;

        DB::transaction(function () use ($serviciosActivos, $periodo, &$generadas) {
            foreach ($serviciosActivos as $servicio) {
                // Evitar duplicados para el mismo período. Se bloquea la fila
                // existente (si la hay) para que dos ejecuciones concurrentes
                // no generen la misma mensualidad dos veces.
                $existe = MensualidadFacturacion::where('servicio_id', $servicio->id)
                    ->where('periodo', $periodo)
                    ->lockForUpdate()
                    ->exists();

                if ($existe) {
                    continue;
                }

                $fechaVencimiento = Carbon::createFromFormat('Y-m', $periodo)
                    ->setDay(min($servicio->dia_corte, 28));

                MensualidadFacturacion::create([
                    'codigo_factura'    => 'FAC-' . $periodo . '-' . strtoupper(Str::random(4)),
                    'cliente_id'        => $servicio->cliente_id,
                    'servicio_id'       => $servicio->id,
                    'periodo'           => $periodo,
                    'monto'             => $servicio->precio_mensual,
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
