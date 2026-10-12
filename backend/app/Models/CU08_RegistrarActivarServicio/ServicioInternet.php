<?php

namespace App\Models\CU08_RegistrarActivarServicio;

use Illuminate\Database\Eloquent\Model;
use App\Models\CU05_RegistrarCliente\Cliente;

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
        'dia_corte',
    ];

    protected $casts = [
        'cliente_id'        => 'integer',
        'velocidad_mbps'    => 'integer',
        'precio_mensual'    => 'decimal:2',
        'fecha_instalacion' => 'date',
        'fecha_activacion'  => 'date',
        'dia_corte'         => 'integer',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }
}
