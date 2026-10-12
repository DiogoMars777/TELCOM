<?php

namespace App\Http\Controllers\CU15_ListaRegistroReactivaciones;

use App\Http\Controllers\Controller;
use App\Models\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\CU15_ListaRegistroReactivaciones\ReactivacionServicio;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReactivacionesController extends Controller
{
    use ApiResponse;

    /**
     * CU15 - Gestionar lista de reactivaciones
     */
    public function index(): JsonResponse
    {
        $reactivaciones = ReactivacionServicio::with(['servicio.cliente', 'pago', 'operador:id,name'])
            ->latest()
            ->paginate(15);

        return $this->success($reactivaciones, 'Lista de reactivaciones obtenida exitosamente.');
    }

    /**
     * CU15 - Registrar reactivación de un servicio cortado
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'servicio_id'        => 'required|exists:servicios_internet,id',
            'pago_id'            => 'nullable|exists:pagos,id',
            'costo_reactivacion' => 'nullable|numeric|min:0',
            'observaciones'      => 'nullable|string|max:500',
        ]);

        return DB::transaction(function () use ($validated) {
            $servicio = ServicioInternet::findOrFail($validated['servicio_id']);

            $reactivacion = ReactivacionServicio::create([
                'codigo_reactivacion' => 'REA-' . date('Ymd') . '-' . strtoupper(Str::random(4)),
                'servicio_id'         => $servicio->id,
                'pago_id'             => $validated['pago_id'] ?? null,
                'user_id'             => auth()->id() ?? 1,
                'fecha_reactivacion'  => now(),
                'costo_reactivacion'  => $validated['costo_reactivacion'] ?? 0.00,
                'observaciones'       => $validated['observaciones'] ?? null,
            ]);

            // Reactivar servicio
            $servicio->update([
                'estado_servicio' => 'ACTIVO',
            ]);

            return $this->success([
                'reactivacion' => $reactivacion,
                'servicio'     => $servicio,
            ], 'Servicio reactivado exitosamente.', 201);
        });
    }
}
