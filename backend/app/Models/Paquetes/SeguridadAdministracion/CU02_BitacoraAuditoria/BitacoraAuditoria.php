<?php

namespace App\Models\Paquetes\SeguridadAdministracion\CU02_BitacoraAuditoria;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class BitacoraAuditoria extends Model
{
    protected $table = 'bitacora_auditorias';

    protected $fillable = [
        'user_id',
        'modulo',
        'accion',
        'detalles',
        'ip_origen',
        'datos_previos',
        'datos_nuevos',
    ];

    protected $casts = [
        'datos_previos' => 'array',
        'datos_nuevos'  => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
