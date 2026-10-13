<?php

namespace App\Http\Controllers\Planes;

use App\Http\Controllers\Controller;
use App\Models\Planes\PlanInternet;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Catálogo de planes de Internet (entidad UML PlanInternet).
 *
 * Permisos REALES ya existentes en el proyecto (matriz RBAC):
 *  - planes.view   -> admin y secretaría.
 *  - planes.assign -> admin y secretaría (ver AsignacionPlanController).
 * El técnico NO tiene ninguno de los dos.
 */
class PlanInternetController extends Controller
{
    use ApiResponse;

    /**
     * Listar el catálogo de planes.
     * Filtro opcional: ?activo=1|0
     */
    public function index(Request $request): JsonResponse
    {
        $query = PlanInternet::query()->orderBy('velocidad_mbps');

        if ($request->has('activo')) {
            $query->where('activo', $request->boolean('activo'));
        }

        return $this->success(
            ['planes' => $query->get()],
            'Planes de Internet obtenidos exitosamente.'
        );
    }

    /**
     * Ver un plan y sus asignaciones (historial).
     */
    public function show(int $id): JsonResponse
    {
        $plan = PlanInternet::with([
            'asignaciones' => fn ($q) => $q->orderByDesc('fecha_inicio')->orderByDesc('id'),
        ])->findOrFail($id);

        return $this->success(
            ['plan' => $plan],
            'Plan de Internet obtenido exitosamente.'
        );
    }
}
