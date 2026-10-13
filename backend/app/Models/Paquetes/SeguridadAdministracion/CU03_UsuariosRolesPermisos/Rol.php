<?php

namespace App\Models\Paquetes\SeguridadAdministracion\CU03_UsuariosRolesPermisos;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Rol extends Model
{
    protected $table = 'roles';

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'activo',
    ];

    public function permisos()
    {
        return $this->belongsToMany(Permiso::class, 'rol_permiso');
    }

    /**
     * Usuarios que tienen este rol (UML: Rol [1] -> Usuario [0..*]).
     */
    public function users()
    {
        return $this->hasMany(User::class, 'rol_id');
    }
}
