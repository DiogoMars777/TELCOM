<?php

namespace App\Http\Controllers\CU14_RegistrarCorteRealizado;

use App\Http\Controllers\Controller;
use App\Models\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\CU14_RegistrarCorteRealizado\RegistroCorte;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CorteRegistroController extends Controller
{
    use ApiResponse;

    /**
     * CU14 - Registrar ejecución de corte de servicio
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'servicio_id'   => 'required|exists:servicios_internet,id',
            'tipo_corte'    => 'required|in:LOGICO,FISICO',
            'motivo'        => 'required|string|max:255',
            'observaciones' => 'nullable|string|max:500',
        ]);

        return DB::transaction(function () use ($validated) {
            $servicio = ServicioInternet::findOrFail($validated['servicio_id']);

            $corte = RegistroCorte::create([
                'codigo_orden_corte' => 'COR-' . date('Ymd') . '-' . strtoupper(Str::random(4)),
                'servicio_id'        => $servicio->id,
                'tecnico_user_id'    => auth()->id() ?? 1,
                'tipo_corte'         => $validated['tipo_corte'],
                'motivo'             => $validated['motivo'],
                'fecha_corte'        => now(),
                'observaciones'      => $validated['observaciones'] ?? null,
            ]);

            // Actualizar estado del servicio a CORTADO
            $servicio->update([
                'estado_servicio' => 'CORTADO',
            ]);

            return $this->success([
                'corte'    => $corte,
                'servicio' => $servicio,
            ], 'Corte de servicio registrado y ejecutado exitosamente.', 201);
        });
    }
}
