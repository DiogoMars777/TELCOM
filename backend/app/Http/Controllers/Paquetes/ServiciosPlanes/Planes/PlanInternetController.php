<?php

namespace App\Http\Controllers\Paquetes\ServiciosPlanes\Planes;

use App\Http\Controllers\Controller;
use App\Models\Paquetes\ServiciosPlanes\Planes\PlanInternet;
use App\Support\AuditLogger;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * CU16 - Gestionar catálogo de planes de Internet (entidad UML PlanInternet).
 *
 * Operaciones: consultar, buscar, crear, editar, activar y desactivar.
 *
 * Permisos REALES del proyecto (ver DatabaseSeeder / EnsurePermission):
 *  - planes.view   -> consultar/buscar (admin y secretaría, requerido por CU17).
 *  - planes.manage -> crear/editar/activar/desactivar (SOLO admin).
 * El técnico no posee ninguno -> HTTP 403 (lo aplica el middleware).
 *
 * NO se expone borrado físico: un plan con asignaciones o historial nunca se
 * elimina; se DESACTIVA. Un plan inactivo no puede asignarse a un servicio
 * (AsignacionPlanController exige `activo = true`).
 */
class PlanInternetController extends Controller
{
    use ApiResponse;

    /** Campos que se devuelven/auditan de un plan. */
    private const CAMPOS = [
        'id', 'nombre_plan', 'velocidad_mbps', 'precio_mensual',
        'descripcion', 'activo',
    ];

    /**
     * Listar / buscar el catálogo de planes.
     * Filtros opcionales: ?buscar=<texto>&activo=1|0
     */
    public function index(Request $request): JsonResponse
    {
        $query = PlanInternet::query();

        if ($request->filled('buscar')) {
            $patron = '%'.$request->input('buscar').'%';
            $query->where(function ($q) use ($patron) {
                // `whereLike(..., caseSensitive: false)` -> ILIKE en PostgreSQL y
                // LIKE (insensible en ASCII) en SQLite: igual en prod y pruebas.
                $q->whereLike('nombre_plan', $patron, caseSensitive: false)
                    ->orWhereLike('descripcion', $patron, caseSensitive: false);
            });
        }

        if ($request->has('activo')) {
            $query->where('activo', $request->boolean('activo'));
        }

        $planes = $query
            ->orderByDesc('activo')
            ->orderBy('velocidad_mbps')
            ->orderBy('nombre_plan')
            ->get();

        return $this->success(
            ['planes' => $planes],
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

    /**
     * Crear un plan del catálogo.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->reglas($request), $this->mensajes());
        $validated['activo'] = $request->boolean('activo', true);

        $plan = PlanInternet::create($validated);

        AuditLogger::log(
            'PLANES',
            'CREAR_PLAN',
            "Plan {$plan->nombre_plan} ({$plan->velocidad_mbps} Mbps) creado.",
            null,
            $plan->only(self::CAMPOS)
        );

        return $this->success(
            ['plan' => $plan],
            'Plan de Internet creado exitosamente.',
            201
        );
    }

    /**
     * Editar un plan existente.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $plan = PlanInternet::findOrFail($id);
        $previos = $plan->only(self::CAMPOS);

        $validated = $request->validate($this->reglas($request, $plan), $this->mensajes());

        $plan->update($validated);
        $plan->refresh();

        AuditLogger::log(
            'PLANES',
            'EDITAR_PLAN',
            "Plan {$plan->nombre_plan} ({$plan->velocidad_mbps} Mbps) actualizado.",
            $previos,
            $plan->only(self::CAMPOS)
        );

        return $this->success(
            ['plan' => $plan],
            'Plan de Internet actualizado exitosamente.'
        );
    }

    /**
     * Activar un plan (habilita nuevas asignaciones).
     */
    public function activar(int $id): JsonResponse
    {
        return $this->cambiarEstado($id, true);
    }

    /**
     * Desactivar un plan.
     *
     * No se borra nada: las asignaciones y precios históricos se conservan.
     * Al quedar inactivo, el plan no puede usarse en nuevas asignaciones.
     */
    public function desactivar(int $id): JsonResponse
    {
        return $this->cambiarEstado($id, false);
    }

    private function cambiarEstado(int $id, bool $activo): JsonResponse
    {
        $plan = PlanInternet::findOrFail($id);

        if ($plan->activo !== $activo) {
            $previos = $plan->only(self::CAMPOS);
            $plan->update(['activo' => $activo]);

            AuditLogger::log(
                'PLANES',
                $activo ? 'ACTIVAR_PLAN' : 'DESACTIVAR_PLAN',
                "Plan {$plan->nombre_plan} ".($activo ? 'activado' : 'desactivado').'.',
                $previos,
                $plan->only(self::CAMPOS)
            );
        }

        return $this->success(
            ['plan' => $plan->refresh()],
            $activo ? 'Plan de Internet activado exitosamente.' : 'Plan de Internet desactivado exitosamente.'
        );
    }

    /**
     * Reglas de validación compartidas por crear y editar.
     *
     * @return array<string, mixed>
     */
    private function reglas(Request $request, ?PlanInternet $plan = null): array
    {
        // Al editar, si no se envía la velocidad se compara contra la vigente.
        $velocidad = $request->input('velocidad_mbps', $plan?->velocidad_mbps);

        return [
            'nombre_plan' => [
                'required',
                'string',
                'max:100',
                // Convención actual del esquema: un plan se identifica por
                // (nombre_plan, velocidad_mbps) -> índice único de la migración.
                Rule::unique('planes_internet', 'nombre_plan')
                    ->where(fn ($q) => $q->where('velocidad_mbps', (int) $velocidad))
                    ->ignore($plan?->id),
            ],
            'velocidad_mbps' => 'required|integer|min:1|max:100000',
            'precio_mensual' => 'required|numeric|min:0|max:99999999.99',
            'descripcion'    => 'nullable|string|max:1000',
            'activo'         => 'sometimes|boolean',
        ];
    }

    /**
     * Mensajes de validación en español.
     *
     * @return array<string, string>
     */
    private function mensajes(): array
    {
        return [
            'nombre_plan.required'      => 'El nombre del plan es obligatorio.',
            'nombre_plan.max'           => 'El nombre del plan no debe superar 100 caracteres.',
            'nombre_plan.unique'        => 'Ya existe un plan con ese nombre y esa velocidad.',
            'velocidad_mbps.required'   => 'La velocidad en Mbps es obligatoria.',
            'velocidad_mbps.integer'    => 'La velocidad debe ser un número entero de Mbps.',
            'velocidad_mbps.min'        => 'La velocidad debe ser mayor que 0 Mbps.',
            'velocidad_mbps.max'        => 'La velocidad indicada no es válida.',
            'precio_mensual.required'   => 'El precio mensual es obligatorio.',
            'precio_mensual.numeric'    => 'El precio mensual debe ser un número.',
            'precio_mensual.min'        => 'El precio mensual no puede ser negativo.',
            'precio_mensual.max'        => 'El precio mensual indicado no es válido.',
            'descripcion.max'           => 'La descripción no debe superar 1000 caracteres.',
        ];
    }
}
