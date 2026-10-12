<?php

namespace App\Http\Controllers\CU05_RegistrarCliente;

use App\Http\Controllers\Controller;
use App\Models\CU05_RegistrarCliente\Cliente;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ClienteRegistroController extends Controller
{
    use ApiResponse;

    /**
     * CU05 - Registrar nuevo cliente
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'documento_identidad' => 'required|string|unique:clientes,documento_identidad',
            'tipo_documento'      => 'required|string|in:CI,NIT,PASAPORTE',
            'nombres'             => 'required|string|max:150',
            'apellidos'           => 'required|string|max:150',
            'telefono'            => 'required|string|max:30',
            'email'               => 'required|email|unique:clientes,email',
            'direccion'           => 'required|string|max:255',
            'zona_id'             => 'required|integer',
        ]);

        $validated['codigo_cliente'] = 'CLI-' . strtoupper(Str::random(6));
        $validated['estado'] = 'ACTIVO';

        $cliente = Cliente::create($validated);

        return $this->success($cliente, 'Cliente registrado exitosamente.', 201);
    }
}
