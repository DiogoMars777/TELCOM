<?php

namespace App\Http\Controllers\CU07_ActualizarBajaCliente;

use App\Http\Controllers\Controller;
use App\Models\CU07_ActualizarBajaCliente\ClienteBajaLogica;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClienteMantenimientoController extends Controller
{
    use ApiResponse;

    /**
     * CU07 - Actualizar datos del cliente
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $cliente = ClienteBajaLogica::findOrFail($id);

        $validated = $request->validate([
            'nombres'   => 'sometimes|string|max:150',
            'apellidos' => 'sometimes|string|max:150',
            'telefono'  => 'sometimes|string|max:30',
            'email'     => 'sometimes|email|unique:clientes,email,' . $cliente->id,
            'direccion' => 'sometimes|string|max:255',
            'zona_id'   => 'sometimes|integer',
        ]);

        $cliente->update($validated);

        return $this->success($cliente, 'Datos del cliente actualizados exitosamente.');
    }

    /**
     * CU07 - Dar de baja lógica al cliente (Soft Delete / Inactivación)
     */
    public function bajaLogica(Request $request, int $id): JsonResponse
    {
        $cliente = ClienteBajaLogica::findOrFail($id);

        $validated = $request->validate([
            'motivo_baja' => 'required|string|max:255',
        ]);

        $cliente->update([
            'estado'      => 'INACTIVO',
            'motivo_baja' => $validated['motivo_baja'],
            'fecha_baja'  => now(),
        ]);

        // Realizar baja lógica
        $cliente->delete();

        return $this->success($cliente, 'Cliente dado de baja lógica exitosamente.');
    }
}
