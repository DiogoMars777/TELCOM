<?php

namespace App\Models\Paquetes\FacturacionCobranza\CU10_GestionarPagoMensualidad;

use Illuminate\Database\Eloquent\Model;
use App\Models\Paquetes\FacturacionCobranza\CU09_GenerarMensualidades\MensualidadFacturacion;
use App\Models\User;

class PagoMensualidad extends Model
{
    protected $table = 'pagos';

    protected $fillable = [
        'codigo_recibo',
        'mensualidad_id',
        'monto_pagado',
        'metodo_pago', // EFECTIVO, TRANSFERENCIA, QR, TARJETA
        'numero_transaccion',
        'fecha_pago',
        'cajero_user_id',
        'observaciones',
    ];

    protected $casts = [
        'monto_pagado'   => 'decimal:2',
        'fecha_pago'     => 'datetime',
        'cajero_user_id' => 'integer',
    ];

    public function mensualidad()
    {
        return $this->belongsTo(MensualidadFacturacion::class, 'mensualidad_id');
    }

    public function cajero()
    {
        return $this->belongsTo(User::class, 'cajero_user_id');
    }
}
