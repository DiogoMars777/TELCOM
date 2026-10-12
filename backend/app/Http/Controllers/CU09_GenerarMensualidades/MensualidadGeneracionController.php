<?php

namespace App\Http\Controllers\CU09_GenerarMensualidades;

use App\Http\Controllers\Controller;
use App\Models\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\CU09_GenerarMensualidades\MensualidadFacturacion;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

        foreach ($serviciosActivos as $servicio) {
            // Evitar duplicados para el mismo período
            $existe = MensualidadFacturacion::where('servicio_id', $servicio->id)
                ->where('periodo', $periodo)
                ->exists();

            if (! $existe) {
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
        }

        return $this->success([
            'periodo'   => $periodo,
            'generadas' => $generadas,
        ], "Se generaron exitosamente {$generadas} mensualidades para el período {$periodo}.");
    }
}
