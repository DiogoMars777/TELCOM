<?php

namespace App\Models\CU08_RegistrarActivarServicio;

use Illuminate\Database\Eloquent\Model;
use App\Models\CU05_RegistrarCliente\Cliente;
use App\Models\CU09_GenerarMensualidades\MensualidadFacturacion;
use App\Models\Planes\AsignacionPlan;

class ServicioInternet extends Model
{
    protected $table = 'servicios_internet';

    protected $fillable = [
        'codigo_servicio',
        'cliente_id',
        'plan_nombre',
        'velocidad_mbps',
        'precio_mensual',
        'ip_asignada',
        'mac_router',
        'direccion_instalacion',
        'fecha_instalacion',
        'fecha_activacion',
        'estado_servicio', // PENDIENTE_INSTALACION, ACTIVO, SUSPENDIDO, CORTADO
        'estado_servicio_id', // Relación nueva hacia el catálogo EstadoServicio
        'dia_corte',
    ];

    protected $casts = [
        'cliente_id'         => 'integer',
        'velocidad_mbps'     => 'integer',
        'precio_mensual'     => 'decimal:2',
        'fecha_instalacion'  => 'date',
        'fecha_activacion'   => 'date',
        'estado_servicio_id' => 'integer',
        'dia_corte'          => 'integer',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    /**
     * Mensualidades (facturas) emitidas para este servicio.
     * Necesaria para CU12 (alertas) y CU13 (elegibilidad a corte por mora).
     */
    public function mensualidades()
    {
        return $this->hasMany(MensualidadFacturacion::class, 'servicio_id');
    }

    /**
     * Relación UML "define": ServicioInternet pertenece a un EstadoServicio.
     * La columna antigua `estado_servicio` se mantiene por compatibilidad
     * con CU08-CU15 y no se elimina en esta etapa.
     */
    public function estado()
    {
        return $this->belongsTo(EstadoServicio::class, 'estado_servicio_id');
    }

    /**
     * Relación UML "posee": ServicioInternet [1] -> AsignacionPlan [1..*].
     * Se conserva todo el historial; una asignación no se sobrescribe.
     */
    public function asignacionesPlan()
    {
        return $this->hasMany(AsignacionPlan::class, 'servicio_id');
    }

    /**
     * Asignación vigente del servicio (fecha_fin NULL). Hay a lo sumo una
     * gracias al índice parcial único de la migración.
     */
    public function asignacionPlanActual()
    {
        return $this->hasOne(AsignacionPlan::class, 'servicio_id')->whereNull('fecha_fin');
    }
}
