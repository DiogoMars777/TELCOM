<?php

namespace App\Models\Paquetes\ServiciosPlanes\Planes;

use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * AsignacionPlan (UML):
 *  - idAsignacionPlan -> id
 *  - fechaInicio      -> fecha_inicio
 *  - fechaFin         -> fecha_fin
 *  - precioAplicado   -> precio_aplicado
 *  - motivoCambio     -> motivo_cambio
 *
 * Relaciones UML:
 *  - "posee":      ServicioInternet [1]  -> AsignacionPlan [1..*]
 *  - "corresponde": PlanInternet    [1]  -> AsignacionPlan [0..*]
 *  - "registra":   Usuario          [1]  -> AsignacionPlan [0..*]
 *
 * `user_id` es NULLABLE porque los servicios históricos no registran quién
 * originó la asignación y no se inventa el dato. Toda asignación nueva lo
 * exige (se toma del usuario autenticado).
 */
class AsignacionPlan extends Model
{
    protected $table = 'asignaciones_plan';

    protected $fillable = [
        'servicio_id',
        'plan_id',
        'user_id',
        'fecha_inicio',
        'fecha_fin',
        'precio_aplicado',
        'motivo_cambio',
    ];

    protected $casts = [
        'servicio_id'     => 'integer',
        'plan_id'         => 'integer',
        'user_id'         => 'integer',
        'fecha_inicio'    => 'date',
        'fecha_fin'       => 'date',
        'precio_aplicado' => 'decimal:2',
    ];

    public function servicio()
    {
        return $this->belongsTo(ServicioInternet::class, 'servicio_id');
    }

    public function plan()
    {
        return $this->belongsTo(PlanInternet::class, 'plan_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Una asignación sin fecha de fin es la vigente para su servicio.
     */
    public function estaVigente(): bool
    {
        return $this->fecha_fin === null;
    }
}
