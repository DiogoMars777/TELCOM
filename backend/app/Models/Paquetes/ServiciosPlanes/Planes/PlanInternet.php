<?php

namespace App\Models\Paquetes\ServiciosPlanes\Planes;

use Illuminate\Database\Eloquent\Model;

/**
 * PlanInternet (UML):
 *  - idPlan          -> id
 *  - nombrePlan      -> nombre_plan
 *  - velocidadMbps   -> velocidad_mbps
 *  - precioMensual   -> precio_mensual
 *  - descripcion     -> descripcion
 *  - activo          -> activo
 *
 * Relación UML "corresponde": PlanInternet [1] -> AsignacionPlan [0..*].
 */
class PlanInternet extends Model
{
    protected $table = 'planes_internet';

    protected $fillable = [
        'nombre_plan',
        'velocidad_mbps',
        'precio_mensual',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'velocidad_mbps' => 'integer',
        'precio_mensual' => 'decimal:2',
        'activo'         => 'boolean',
    ];

    public function asignaciones()
    {
        return $this->hasMany(AsignacionPlan::class, 'plan_id');
    }
}
