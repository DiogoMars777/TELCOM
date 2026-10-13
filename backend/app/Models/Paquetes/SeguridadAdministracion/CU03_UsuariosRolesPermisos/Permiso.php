<?php

namespace App\Models\Paquetes\SeguridadAdministracion\CU03_UsuariosRolesPermisos;

use Illuminate\Database\Eloquent\Model;

class Permiso extends Model
{
    protected $table = 'permisos';

    protected $fillable = [
        'nombre',
        'slug',
        'modulo',
    ];

    public function roles()
    {
        return $this->belongsToMany(Rol::class, 'rol_permiso');
    }
}
