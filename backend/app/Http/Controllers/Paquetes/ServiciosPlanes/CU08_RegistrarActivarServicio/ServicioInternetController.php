<?php

namespace App\Http\Controllers\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio;

use App\Http\Controllers\Controller;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\EstadoServicio;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\ServicioInternet;
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
     */
    public function index(): JsonResponse
    {
        $servicios = ServicioInternet::with('cliente:id,nombres,apellidos,documento_identidad')
            ->latest()
            ->paginate(15);

        return $this->success($servicios, 'Servicios de Internet obtenidos exitosamente.');
    }

    /**
     * CU08 - Registrar solicitud de servicio
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cliente_id'            => 'required|exists:clientes,id',
            'plan_nombre'           => 'required|string|max:100',
            'velocidad_mbps'        => 'required|integer|min:10',
            'precio_mensual'        => 'required|numeric|min:0',
            'ip_asignada'           => 'nullable|ip',
            'mac_router'            => 'nullable|string|max:50',
            'direccion_instalacion' => 'required|string|max:255',
            'dia_corte'             => 'required|integer|min:1|max:31',
        ]);

        $validated['codigo_servicio'] = 'SRV-' . strtoupper(Str::random(6));
        $validated['estado_servicio'] = 'PENDIENTE_INSTALACION';
        // Mantiene sincronizada la relación nueva (UML "define") sin alterar
        // el comportamiento previo basado en `estado_servicio`.
        $validated['estado_servicio_id'] = EstadoServicio::where('nombre_estado', 'PENDIENTE_INSTALACION')->value('id');
        $validated['fecha_instalacion'] = now();

        $servicio = ServicioInternet::create($validated);

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
