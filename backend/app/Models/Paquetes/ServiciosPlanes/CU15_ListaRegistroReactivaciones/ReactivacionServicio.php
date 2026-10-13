<?php

namespace App\Models\Paquetes\ServiciosPlanes\CU15_ListaRegistroReactivaciones;

use Illuminate\Database\Eloquent\Model;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\Paquetes\FacturacionCobranza\CU10_GestionarPagoMensualidad\PagoMensualidad;
use App\Models\User;

class ReactivacionServicio extends Model
{
    protected $table = 'reactivaciones_servicio';

    protected $fillable = [
        'codigo_reactivacion',
        'servicio_id',
        'pago_id',
        'user_id', // Usuario o técnico que procesa
        'fecha_reactivacion',
        'costo_reactivacion',
        'observaciones',
    ];

    protected $casts = [
        'servicio_id'        => 'integer',
        'pago_id'            => 'integer',
        'fecha_reactivacion' => 'datetime',
        'costo_reactivacion' => 'decimal:2',
    ];

    public function servicio()
    {
        return $this->belongsTo(ServicioInternet::class, 'servicio_id');
    }

    public function pago()
    {
        return $this->belongsTo(PagoMensualidad::class, 'pago_id');
    }

    public function operador()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
