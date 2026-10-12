<?php

namespace App\Models\CU03_UsuariosRolesPermisos;

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

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
