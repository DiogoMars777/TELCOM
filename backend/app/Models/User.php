<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Paquetes\SeguridadAdministracion\CU03_UsuariosRolesPermisos\Rol;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'nombre_usuario', 'email', 'password', 'telefono', 'activo', 'rol_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Rol asignado al usuario (UML: Rol [1] -> Usuario [0..*]).
     */
    public function rol(): BelongsTo
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }

    /**
     * Comprueba si el usuario posee un permiso puntual según su rol.
     * Exige que el usuario y su rol estén activos; sin rol, sin permiso.
     */
    public function hasPermission(string $slug): bool
    {
        if (! $this->activo) {
            return false;
        }

        $rol = $this->rol;
        if (! $rol || ! $rol->activo) {
            return false;
        }

        return $rol->permisos()->where('permisos.slug', $slug)->exists();
    }

    /**
     * Slugs de los permisos efectivos del usuario (según su rol activo).
     * Devuelve [] si el usuario o el rol están inactivos, o si no tiene rol.
     * Se usa para que el frontend pueda filtrar los menús por permisos reales.
     *
     * @return array<int, string>
     */
    public function permisosSlugs(): array
    {
        if (! $this->activo) {
            return [];
        }

        $rol = $this->rol;
        if (! $rol || ! $rol->activo) {
            return [];
        }

        return $rol->permisos()->pluck('permisos.slug')->all();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'activo' => 'boolean',
        ];
    }
}
