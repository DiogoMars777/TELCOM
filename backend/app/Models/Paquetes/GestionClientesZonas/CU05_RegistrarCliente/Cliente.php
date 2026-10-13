<?php

namespace App\Models\Paquetes\GestionClientesZonas\CU05_RegistrarCliente;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cliente extends Model
{
    use SoftDeletes;

    protected $table = 'clientes';

    protected $fillable = [
        'codigo_cliente',
        'documento_identidad',
        'tipo_documento', // CI, NIT, Pasaporte
        'nombres',
        'apellidos',
        'telefono',
        'email',
        'direccion',
        'zona_id',
        'estado', // ACTIVO, INACTIVO, SUSPENDIDO
    ];

    protected $casts = [
        'zona_id' => 'integer',
    ];
}
