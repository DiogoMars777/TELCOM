<?php

namespace App\Http\Controllers\CU13_ListadoServiciosCorte;

use App\Http\Controllers\Controller;
use App\Models\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiciosCorteController extends Controller
{
    use ApiResponse;

    /**
     * CU13 - Consultar listado de servicios para corte
     */
    public function index(Request $request): JsonResponse
    {
        $diasMora = $request->integer('dias_mora', 5);

        // Obtenemos los servicios activos que tienen mensualidades pendientes vencidas
        $servicios = ServicioInternet::with(['cliente'])
            ->where('estado_servicio', 'ACTIVO')
            ->latest()
            ->paginate(15);

        return $this->success($servicios, 'Listado de servicios pendientes de corte obtenido.');
    }
}
