<?php

namespace App\Http\Controllers\CU01_IniciarCerrarSesion;

use App\Http\Controllers\Controller;
use App\Models\CU01_IniciarCerrarSesion\UserSession;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * CU01 - Iniciar sesión de usuario
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return $this->error('Credenciales incorrectas.', 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Registrar sesión activa
        UserSession::create([
            'user_id'    => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'login_at'   => now(),
            'is_active'  => true,
        ]);

        return $this->success([
            'user'  => $user,
            'token' => $token,
        ], 'Inicio de sesión exitoso.');
    }

    /**
     * CU01 - Cerrar sesión de usuario
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            // Revocar tokens
            $user->currentAccessToken()->delete();

            // Cerrar registro de sesión
            UserSession::where('user_id', $user->id)
                ->where('is_active', true)
                ->latest()
                ->first()
                ?->update([
                    'logout_at' => now(),
                    'is_active' => false,
                ]);
        }

        return $this->success(null, 'Sesión finalizada exitosamente.');
    }

    /**
     * CU01 - Obtener usuario autenticado actual
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success($request->user(), 'Datos de usuario actual.');
    }
}
