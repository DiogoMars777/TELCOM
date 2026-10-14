<?php

namespace App\Models\Paquetes\SeguridadAdministracion\CU02_BitacoraAuditoria;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class BitacoraAuditoria extends Model
{
    protected $table = 'Bitacora';
    protected $primaryKey = 'idBitacora';
    public $timestamps = false;

    protected $fillable = [
        'idBitacora',
        'fechaHora',
        'accion',
        'modulo',
        'descripcion',
        'idUsuario',
        'ipOrigen',
        'datosPrevios',
        'datosNuevos',
        // alias de compatibilidad
        'user_id',
        'detalles',
        'ip_origen',
        'datos_previos',
        'datos_nuevos',
    ];

    protected $casts = [
        'fechaHora'     => 'datetime',
        'datosPrevios'  => 'array',
        'datosNuevos'   => 'array',
        'datos_previos' => 'array',
        'datos_nuevos'  => 'array',
    ];

    protected $appends = [
        'id',
        'user_id',
        'detalles',
        'ip_origen',
    ];

    public function newEloquentBuilder($query)
    {
        return new class($query) extends \Illuminate\Database\Eloquent\Builder {
            public function where($column, $operator = null, $value = null, $boolean = 'and')
            {
                if (is_string($column)) {
                    $column = match ($column) {
                        'id' => 'idBitacora',
                        'user_id' => 'idUsuario',
                        'detalles' => 'descripcion',
                        'ip_origen' => 'ipOrigen',
                        'datos_previos' => 'datosPrevios',
                        'datos_nuevos' => 'datosNuevos',
                        default => $column,
                    };
                }
                return parent::where($column, $operator, $value, $boolean);
            }

            public function whereNotNull($columns, $boolean = 'and')
            {
                if ($columns === 'user_id') {
                    $columns = 'idUsuario';
                }
                return parent::whereNotNull($columns, $boolean);
            }

            public function pluck($column, $key = null)
            {
                if ($column === 'user_id') {
                    $column = 'idUsuario';
                } elseif ($column === 'id') {
                    $column = 'idBitacora';
                }
                return parent::pluck($column, $key);
            }
        };
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'idUsuario', 'idUsuario');
    }

    public function getUserIdAttribute(): ?int
    {
        return isset($this->attributes['idUsuario']) ? (int) $this->attributes['idUsuario'] : null;
    }

    public function setUserIdAttribute(?int $value): void
    {
        $this->attributes['idUsuario'] = $value;
    }

    public function getDetallesAttribute(): ?string
    {
        return $this->attributes['descripcion'] ?? null;
    }

    public function setDetallesAttribute(?string $value): void
    {
        $this->attributes['descripcion'] = $value;
    }

    public function getIpOrigenAttribute(): ?string
    {
        return $this->attributes['ipOrigen'] ?? null;
    }

    public function setIpOrigenAttribute(?string $value): void
    {
        $this->attributes['ipOrigen'] = $value;
    }

    public function getIdAttribute(): ?int
    {
        return isset($this->attributes['idBitacora']) ? (int) $this->attributes['idBitacora'] : null;
    }
}
