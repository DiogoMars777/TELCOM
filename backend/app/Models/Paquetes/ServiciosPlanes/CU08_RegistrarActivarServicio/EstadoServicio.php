<?php

namespace App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio;

use Illuminate\Database\Eloquent\Model;

/**
 * EstadoServicio (UML):
 *  - idEstadoServicio -> id
 *  - nombreEstado     -> nombre_estado
 *  - descripcion      -> descripcion
 *
 * Relación UML "define": EstadoServicio [1] -> ServicioInternet [0..*].
 */
class EstadoServicio extends Model
{
    protected $table = 'estados_servicio';

    protected $fillable = [
        'nombre_estado',
        'descripcion',
    ];

    public function servicios()
    {
        return $this->hasMany(ServicioInternet::class, 'estado_servicio_id');
    }
}
