<?php

namespace App\Models;

use App\Models\Paquetes\SeguridadAdministracion\CU03_UsuariosRolesPermisos\Rol;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'Usuario';
    protected $primaryKey = 'idUsuario';
    public $timestamps = false;

    protected $fillable = [
        'idUsuario',
        'nombreUsuario',
        'passwordHash',
        'nombreCompleto',
        'telefono',
        'correo',
        'activo',
        'fechaCreacion',
        'idRol',
        // Alias de compatibilidad
        'name',
        'nombre_usuario',
        'email',
        'password',
        'rol_id',
    ];

    protected $hidden = [
        'passwordHash',
        'password',
        'remember_token',
    ];

    protected $appends = [
        'id',
        'name',
        'email',
        'rol_id',
    ];

    protected static function booted(): void
    {
        static::creating(function ($user) {
            if (empty($user->nombreUsuario)) {
                $user->nombreUsuario = $user->correo ?? $user->email ?? ('user_' . uniqid());
            }
            if (empty($user->fechaCreacion)) {
                $user->fechaCreacion = now();
            }
            if (!isset($user->activo)) {
                $user->activo = true;
            }
        });
    }

    public function newEloquentBuilder($query)
    {
        return new class($query) extends \Illuminate\Database\Eloquent\Builder {
            public function where($column, $operator = null, $value = null, $boolean = 'and')
            {
                if (is_string($column)) {
                    $column = match ($column) {
                        'id' => 'idUsuario',
                        'email' => 'correo',
                        'rol_id' => 'idRol',
                        'name' => 'nombreCompleto',
                        'password' => 'passwordHash',
                        default => $column,
                    };
                }
                return parent::where($column, $operator, $value, $boolean);
            }

            public function whereIn($column, $values, $boolean = 'and', $not = false)
            {
                if (is_string($column)) {
                    $column = match ($column) {
                        'id' => 'idUsuario',
                        'email' => 'correo',
                        'rol_id' => 'idRol',
                        'name' => 'nombreCompleto',
                        default => $column,
                    };
                }
                return parent::whereIn($column, $values, $boolean, $not);
            }

            public function whereNotNull($columns, $boolean = 'and')
            {
                if ($columns === 'email') $columns = 'correo';
                if ($columns === 'rol_id') $columns = 'idRol';
                if ($columns === 'id') $columns = 'idUsuario';
                return parent::whereNotNull($columns, $boolean);
            }

            public function pluck($column, $key = null)
            {
                if ($column === 'email') $column = 'correo';
                if ($column === 'id') $column = 'idUsuario';
                if ($column === 'rol_id') $column = 'idRol';
                return parent::pluck($column, $key);
            }
        };
    }

    public function getAuthIdentifierName(): string
    {
        return 'idUsuario';
    }

    public function getAuthPassword(): string
    {
        return (string) ($this->attributes['passwordHash'] ?? $this->attributes['password'] ?? '');
    }

    // --- Mapeos bidireccionales de atributos ---
    public function getEmailAttribute(): ?string
    {
        return $this->attributes['correo'] ?? null;
    }

    public function setEmailAttribute(?string $value): void
    {
        $this->attributes['correo'] = $value;
    }

    public function getCorreoAttribute(): ?string
    {
        return $this->attributes['correo'] ?? null;
    }

    public function setCorreoAttribute(?string $value): void
    {
        $this->attributes['correo'] = $value;
    }

    public function getPasswordAttribute(): ?string
    {
        return $this->attributes['passwordHash'] ?? null;
    }

    public function setPasswordAttribute(?string $value): void
    {
        if ($value !== null && !str_starts_with($value, '$2y$') && !str_starts_with($value, '$2a$')) {
            $this->attributes['passwordHash'] = \Illuminate\Support\Facades\Hash::make($value);
        } else {
            $this->attributes['passwordHash'] = $value;
        }
    }

    public function setPasswordHashAttribute(?string $value): void
    {
        if ($value !== null && !str_starts_with($value, '$2y$') && !str_starts_with($value, '$2a$')) {
            $this->attributes['passwordHash'] = \Illuminate\Support\Facades\Hash::make($value);
        } else {
            $this->attributes['passwordHash'] = $value;
        }
    }

    public function getNameAttribute(): ?string
    {
        return $this->attributes['nombreCompleto'] ?? $this->attributes['nombreUsuario'] ?? null;
    }

    public function setNameAttribute(?string $value): void
    {
        $this->attributes['nombreCompleto'] = $value;
    }

    public function getNombreUsuarioAttribute(): ?string
    {
        return $this->attributes['nombreUsuario'] ?? null;
    }

    public function setNombreUsuarioAttribute(?string $value): void
    {
        $this->attributes['nombreUsuario'] = $value;
    }

    public function getRolIdAttribute(): ?int
    {
        return isset($this->attributes['idRol']) ? (int) $this->attributes['idRol'] : null;
    }

    public function setRolIdAttribute(?int $value): void
    {
        $this->attributes['idRol'] = $value;
    }

    public function getIdAttribute(): ?int
    {
        return isset($this->attributes['idUsuario']) ? (int) $this->attributes['idUsuario'] : null;
    }

    /**
     * Rol asignado al usuario (UML: Rol [1] -> Usuario [0..*]).
     */
    public function rol(): BelongsTo
    {
        return $this->belongsTo(Rol::class, 'idRol', 'idRol');
    }

    /**
     * Comprueba si el usuario posee un permiso puntual según su rol.
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

        return $rol->permisos()
            ->where(function ($q) use ($slug) {
                $q->where('Permiso.slug', $slug)
                  ->orWhere('Permiso.nombre', $slug);
            })
            ->exists();
    }

    /**
     * Slugs de los permisos efectivos del usuario.
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

        return $rol->permisos()
            ->pluck('Permiso.slug')
            ->filter()
            ->values()
            ->all();
    }

    protected function casts(): array
    {
        return [
            'activo'        => 'boolean',
            'fechaCreacion' => 'datetime',
            'passwordHash'  => 'hashed',
        ];
    }
}
