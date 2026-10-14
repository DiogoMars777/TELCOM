<?php

namespace App\Http\Controllers\Paquetes\ServiciosPlanes\Planes;

use App\Http\Controllers\Controller;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\Paquetes\ServiciosPlanes\Planes\AsignacionPlan;
use App\Models\Paquetes\ServiciosPlanes\Planes\PlanInternet;
use App\Support\AuditLogger;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * Asignación de planes a un servicio de Internet (historial que NO se
 * sobrescribe). Entidad UML AsignacionPlan.
 *
 * Permisos REALES (matriz RBAC existente):
 *  - planes.view   -> consultar el historial.
 *  - planes.assign -> asignar/cambiar plan (admin y secretaría).
 * El técnico NO posee ninguno -> HTTP 403 (lo aplica el middleware).
 */
class AsignacionPlanController extends Controller
{
    use ApiResponse;

    /**
     * Historial de planes de un servicio (más reciente primero).
     */
    public function index(ServicioInternet $servicio): JsonResponse
    {
        $asignaciones = AsignacionPlan::with(['plan', 'usuario:id,name,email'])
            ->where('servicio_id', $servicio->id)
            ->orderByDesc('fecha_inicio')
            ->orderByDesc('id')
            ->get();

        return $this->success([
            'servicio'     => $servicio->only([
                'id', 'codigo_servicio', 'plan_nombre', 'velocidad_mbps',
                'precio_mensual', 'estado_servicio', 'estado_servicio_id',
            ]),
            'asignaciones' => $asignaciones,
        ], 'Historial de planes del servicio obtenido exitosamente.');
    }

    /**
     * Asignar (o cambiar) el plan de un servicio.
     *
     * Reglas:
     *  - El plan debe existir y estar ACTIVO.
     *  - Se cierra la asignación vigente (fecha_fin) SIN borrarla.
     *  - Se crea una nueva asignación con el usuario autenticado (UML "registra").
     */
    public function store(Request $request, ServicioInternet $servicio): JsonResponse
    {
        $validated = $request->validate([
            'plan_id' => [
                'required',
                'integer',
                Rule::exists('planes_internet', 'id')->where('activo', true),
            ],
            'motivo_cambio' => 'nullable|string|max:255',
        ], [
            'plan_id.exists' => 'El plan indicado no existe o está inactivo.',
        ]);

        $plan = PlanInternet::findOrFail($validated['plan_id']);
        $fecha = now()->toDateString();
        $userId = $request->user()->id;

        $asignacion = DB::transaction(function () use ($servicio, $plan, $validated, $fecha, $userId) {
            // Cerrar la asignación vigente conservando el historial.
            AsignacionPlan::where('idServicio', $servicio->idServicio)
                ->whereNull('fechaFin')
                ->update(['fechaFin' => $fecha]);

            $nueva = AsignacionPlan::create([
                'servicio_id'     => $servicio->id,
                'plan_id'         => $plan->id,
                'user_id'         => $userId,
                'fecha_inicio'    => $fecha,
                'fecha_fin'       => null,
                'precio_aplicado' => $plan->precio_mensual,
                'motivo_cambio'   => $validated['motivo_cambio'] ?? 'Asignación de plan',
            ]);

            // Mantener coherente el "snapshot" legado que ya consume CU08.
            // Los valores históricos quedan preservados en asignaciones_plan.
            $servicio->update([
                'plan_nombre'    => $plan->nombre_plan,
                'velocidad_mbps' => $plan->velocidad_mbps,
                'precio_mensual' => $plan->precio_mensual,
            ]);

            AuditLogger::log(
                'PLANES',
                'ASIGNAR_PLAN',
                "Plan {$plan->nombre_plan} asignado al servicio {$servicio->codigo_servicio}.",
                null,
                ['servicio_id' => $servicio->id, 'plan_id' => $plan->id, 'precio_aplicado' => $plan->precio_mensual]
            );

            return $nueva;
        });

        return $this->success(
            ['asignacion' => $asignacion->load(['plan', 'usuario:id,name,email'])],
            'Plan asignado al servicio exitosamente.',
            201
        );
    }
}
