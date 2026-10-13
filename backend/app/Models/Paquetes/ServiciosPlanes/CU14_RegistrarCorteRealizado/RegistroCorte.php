<?php

namespace App\Models\Paquetes\ServiciosPlanes\CU14_RegistrarCorteRealizado;

use Illuminate\Database\Eloquent\Model;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\User;

class RegistroCorte extends Model
{
    protected $table = 'cortes_servicio';

    protected $fillable = [
        'codigo_orden_corte',
        'servicio_id',
        'tecnico_user_id',
        'tipo_corte', // LOGICO, FISICO
        'motivo',
        'fecha_corte',
        'observaciones',
    ];

    protected $casts = [
        'servicio_id'     => 'integer',
        'tecnico_user_id' => 'integer',
        'fecha_corte'     => 'datetime',
    ];

    public function servicio()
    {
        return $this->belongsTo(ServicioInternet::class, 'servicio_id');
    }

    public function tecnico()
    {
        return $this->belongsTo(User::class, 'tecnico_user_id');
    }
}
