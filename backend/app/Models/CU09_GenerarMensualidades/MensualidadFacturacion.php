<?php

namespace App\Models\CU09_GenerarMensualidades;

use Illuminate\Database\Eloquent\Model;
use App\Models\CU05_RegistrarCliente\Cliente;
use App\Models\CU08_RegistrarActivarServicio\ServicioInternet;

class MensualidadFacturacion extends Model
{
    protected $table = 'mensualidades';

    protected $fillable = [
        'codigo_factura',
        'cliente_id',
        'servicio_id',
        'periodo', // Formato YYYY-MM
        'monto',
        'fecha_emision',
        'fecha_vencimiento',
        'estado_pago', // PENDIENTE, PAGADO, VENCIDO, ANULADO
    ];

    protected $casts = [
        'monto'             => 'decimal:2',
        'fecha_emision'     => 'date',
        'fecha_vencimiento' => 'date',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function servicio()
    {
        return $this->belongsTo(ServicioInternet::class, 'servicio_id');
    }
}
