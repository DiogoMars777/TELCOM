<?php

namespace App\Http\Controllers\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio;

use App\Http\Controllers\Controller;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\EstadoServicio;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\Paquetes\ServiciosPlanes\Planes\AsignacionPlan;
use App\Models\Paquetes\ServiciosPlanes\Planes\PlanInternet;
use App\Support\AuditLogger;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServicioInternetController extends Controller
{
    use ApiResponse;

    /**
     * CU08 - Listar servicios de Internet
     *
     * Filtro opcional ?buscar=<texto> por código de servicio, plan o datos del
     * cliente. Lo reutiliza CU17 para localizar el servicio al que asignar plan.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ServicioInternet::with(['cliente', 'asignacionPlanActual.plan']);

        if ($request->filled('buscar')) {
            $patron = '%'.$request->input('buscar').'%';
            $query->where(function ($q) use ($patron) {
                $q->where('codigo_servicio', 'like', $patron)
                    ->orWhereHas('cliente', function ($c) use ($patron) {
                        $c->where('nombreCompleto', 'like', $patron)
                            ->orWhere('ci', 'like', $patron);
                    });
            });
        }

        $servicios = $query->latest('idServicio')->paginate(15);


        return $this->success($servicios, 'Servicios de Internet obtenidos exitosamente.');
    }

    /**
     * CU08 - Registrar solicitud de servicio
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cliente_id'            => 'required|exists:Cliente,idCliente',
            'plan_id'               => 'nullable',
            'plan_nombre'           => 'required|string|max:100',
            'velocidad_mbps'        => 'required|integer|min:10',
            'precio_mensual'        => 'required|numeric|min:0',
            'ip_asignada'           => 'nullable|ip',
            'mac_router'            => 'nullable|string|max:50',
            'direccion_instalacion' => 'required|string|max:255',
            'dia_corte'             => 'required|integer|min:1|max:31',
        ]);

        $tieneRed = !empty($validated['ip_asignada']) && !empty($validated['mac_router']);
        $estadoInicial = $tieneRed ? 'ACTIVO' : 'PENDIENTE_INSTALACION';

        $validated['codigo_servicio'] = 'SRV-' . strtoupper(Str::random(6));
        $validated['estado_servicio'] = $estadoInicial;
        $validated['estado_servicio_id'] = EstadoServicio::where('nombre_estado', $estadoInicial)->value('id');
        $validated['fecha_instalacion'] = now();
        if ($tieneRed) {
            $validated['fecha_activacion'] = now();
        }

        $servicio = ServicioInternet::create($validated);

        // Crear la asignación del plan en la entidad canónica AsignacionPlan
        $planId = $request->input('plan_id');
        if (!$planId) {
            $plan = PlanInternet::firstOrCreate(
                ['nombrePlan' => $validated['plan_nombre']],
                [
                    'velocidadMbps' => $validated['velocidad_mbps'],
                    'precioMensual' => $validated['precio_mensual'],
                    'descripcion'   => 'Plan asignado en contratación.',
                    'activo'        => true,
                ]
            );
            $planId = $plan->idPlan;
        }

        if ($planId) {
            AsignacionPlan::create([
                'idServicio'     => $servicio->idServicio,
                'idPlan'         => $planId,
                'fechaInicio'    => now()->toDateString(),
                'precioAplicado' => $validated['precio_mensual'],
                'motivoCambio'   => 'Contratación inicial del servicio.',
                'idUsuario'      => auth()->id(),
            ]);
        }

        $servicio->load(['cliente', 'asignacionPlanActual.plan']);

        AuditLogger::log(
            'CU08',
            'REGISTRAR_SERVICIO',
            "Servicio {$servicio->codigo_servicio} registrado para el cliente {$servicio->cliente_id}.",
            null,
            ['id' => $servicio->id, 'codigo_servicio' => $servicio->codigo_servicio, 'estado_servicio' => $servicio->estado_servicio]
        );

        return $this->success($servicio, 'Servicio de Internet registrado exitosamente.', 201);
    }

    /**
     * CU08 - Activar el servicio de Internet tras verificación técnica
     */
    public function activar(Request $request, int $id): JsonResponse
    {
        $servicio = ServicioInternet::findOrFail($id);

        $validated = $request->validate([
            'ip_asignada' => 'required|ip',
            'mac_router'  => 'required|string',
        ]);

        $servicio->update([
            'ip_asignada'      => $validated['ip_asignada'],
            'mac_router'       => $validated['mac_router'],
            'fecha_activacion' => now(),
            'estado_servicio'  => 'ACTIVO',
            'estado_servicio_id' => EstadoServicio::where('nombre_estado', 'ACTIVO')->value('id'),
        ]);

        AuditLogger::log(
            'CU08',
            'ACTIVAR_SERVICIO',
            "Servicio {$servicio->codigo_servicio} activado.",
            null,
            ['id' => $servicio->id, 'estado_servicio' => 'ACTIVO', 'ip_asignada' => $servicio->ip_asignada]
        );

        return $this->success($servicio, 'Servicio de Internet activado exitosamente.');
    }
}
