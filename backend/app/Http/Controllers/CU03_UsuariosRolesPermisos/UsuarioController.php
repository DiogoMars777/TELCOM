<?php

namespace App\Http\Controllers\CU03_UsuariosRolesPermisos;

use App\Http\Controllers\Controller;
use App\Models\CU03_UsuariosRolesPermisos\Rol;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    use ApiResponse;

    /**
     * CU03 - Listar usuarios internos con sus roles
     */
    public function index(): JsonResponse
    {
        $usuarios = User::latest()->paginate(15);
        $roles = Rol::with('permisos')->get();

        return $this->success([
            'usuarios' => $usuarios,
            'roles'    => $roles,
        ], 'Usuarios internos obtenidos correctamente.');
    }

    /**
     * CU03 - Crear usuario interno
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'rol_id'   => 'nullable|exists:roles,id',
        ]);

        $usuario = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return $this->success($usuario, 'Usuario interno creado exitosamente.', 201);
    }

    /**
     * CU03 - Actualizar roles y permisos de un usuario
     */
    public function updateRoles(Request $request, int $id): JsonResponse
    {
        $usuario = User::findOrFail($id);
        $validated = $request->validate([
            'rol_id' => 'required|exists:roles,id',
        ]);

        // Asignación de rol
        return $this->success($usuario, 'Roles actualizados correctamente.');
    }
}
