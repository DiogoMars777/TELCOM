<?php

namespace App\Models\Paquetes\ServiciosPlanes\Planes;

use Illuminate\Database\Eloquent\Model;

class PlanInternet extends Model
{
    protected $table = 'PlanInternet';
    protected $primaryKey = 'idPlan';
    public $timestamps = false;

    protected $fillable = [
        'idPlan',
        'nombrePlan',
        'velocidadMbps',
        'precioMensual',
        'descripcion',
        'activo',
        // alias
        'nombre_plan',
        'velocidad_mbps',
        'precio_mensual',
    ];

    protected $casts = [
        'velocidadMbps'  => 'integer',
        'precioMensual'  => 'decimal:2',
        'activo'         => 'boolean',
        'velocidad_mbps' => 'integer',
        'precio_mensual' => 'decimal:2',
    ];

    protected $appends = [
        'id',
        'nombre_plan',
        'velocidad_mbps',
        'precio_mensual',
    ];

    public function newEloquentBuilder($query)
    {
        return new class($query) extends \Illuminate\Database\Eloquent\Builder {
            public function where($column, $operator = null, $value = null, $boolean = 'and')
            {
                if (is_string($column)) {
                    $column = match ($column) {
                        'nombre_plan' => 'nombrePlan',
                        'velocidad_mbps' => 'velocidadMbps',
                        'precio_mensual' => 'precioMensual',
                        default => $column,
                    };
                }
                return parent::where($column, $operator, $value, $boolean);
            }
        };
    }

    public function asignaciones()
    {
        return $this->hasMany(AsignacionPlan::class, 'idPlan', 'idPlan');
    }

    public function getIdAttribute(): ?int
    {
        return isset($this->attributes['idPlan']) ? (int) $this->attributes['idPlan'] : null;
    }

    public function getNombrePlanAttribute(): ?string
    {
        return $this->attributes['nombrePlan'] ?? null;
    }

    public function setNombrePlanAttribute(?string $value): void
    {
        $this->attributes['nombrePlan'] = $value;
    }

    public function getVelocidadMbpsAttribute(): ?int
    {
        return isset($this->attributes['velocidadMbps']) ? (int) $this->attributes['velocidadMbps'] : null;
    }

    public function setVelocidadMbpsAttribute($value): void
    {
        $this->attributes['velocidadMbps'] = $value;
    }

    public function getPrecioMensualAttribute(): ?string
    {
        return isset($this->attributes['precioMensual']) ? (string) $this->attributes['precioMensual'] : null;
    }

    public function setPrecioMensualAttribute($value): void
    {
        $this->attributes['precioMensual'] = $value;
    }
}
