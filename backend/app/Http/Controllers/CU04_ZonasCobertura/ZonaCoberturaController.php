<?php

namespace App\Http\Controllers\CU04_ZonasCobertura;

use App\Http\Controllers\Controller;
use App\Models\CU04_ZonasCobertura\ZonaCobertura;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ZonaCoberturaController extends Controller
{
    use ApiResponse;

    /**
     * CU04 - Listar zonas de cobertura
     */
    public function index(): JsonResponse
    {
        $zonas = ZonaCobertura::orderBy('nombre')->get();
        return $this->success($zonas, 'Zonas de cobertura obtenidas exitosamente.');
    }

    /**
     * CU04 - Crear zona de cobertura
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'codigo'          => 'required|string|unique:zonas_cobertura,codigo',
            'nombre'          => 'required|string|max:150',
            'ciudad'          => 'required|string|max:100',
            'tecnologia'      => 'required|string',
            'capacidad_nodos' => 'required|integer|min:1',
        ]);

        $zona = ZonaCobertura::create($validated);

        return $this->success($zona, 'Zona de cobertura registrada exitosamente.', 201);
    }

    /**
     * CU04 - Actualizar zona de cobertura
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $zona = ZonaCobertura::findOrFail($id);

        $validated = $request->validate([
            'nombre'          => 'sometimes|string|max:150',
            'ciudad'          => 'sometimes|string|max:100',
            'tecnologia'      => 'sometimes|string',
            'capacidad_nodos' => 'sometimes|integer|min:1',
            'activo'          => 'sometimes|boolean',
        ]);

        $zona->update($validated);

        return $this->success($zona, 'Zona de cobertura actualizada exitosamente.');
    }
}
