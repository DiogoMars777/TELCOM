<?php

namespace App\Http\Controllers\CU13_ListadoServiciosCorte;

use App\Http\Controllers\Controller;
use App\Models\CU13_ListadoServiciosCorte\ServicioParaCorte;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiciosCorteController extends Controller
{
    use ApiResponse;

    /**
     * CU13 - Consultar listado de servicios elegibles para corte.
     *
     * Un servicio es elegible si está ACTIVO y tiene al menos una
     * mensualidad impaga vencida hace `dias_mora` días o más (tolerancia).
     * Se calculan en el backend `monto_deuda`, `dias_mora` y el número de
     * mensualidades pendientes, que el frontend muestra.
     */
    public function index(Request $request): JsonResponse
    {
        $diasMora = max(0, $request->integer('dias_mora', 5));

        $servicios = ServicioParaCorte::query()
            ->with(['cliente:id,nombres,apellidos,documento_identidad,telefono'])
            ->with(['mensualidades' => function ($q) {
                $q->where('estado_pago', '!=', 'PAGADO')->orderBy('fecha_vencimiento');
            }])
            ->elegiblesParaCorte($diasMora)
            ->latest('id')
            ->paginate(15);

        $servicios->getCollection()->transform(function (ServicioParaCorte $servicio) {
            $impagas = $servicio->mensualidades;
            $hoy = now()->startOfDay();

            $servicio->setAttribute('mensualidades_pendientes', $impagas->count());
            $servicio->setAttribute('monto_deuda', round((float) $impagas->sum('monto'), 2));
            $servicio->setAttribute('dias_mora', (int) $impagas->map(
                fn ($m) => (int) $m->fecha_vencimiento->startOfDay()->diffInDays($hoy)
            )->max());

            return $servicio->makeHidden('mensualidades');
        });

        return $this->success($servicios, 'Listado de servicios pendientes de corte obtenido.');
    }
}
