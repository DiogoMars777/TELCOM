<?php

namespace App\Models\Paquetes\GestionClientesZonas\CU04_ZonasCobertura;

use Illuminate\Database\Eloquent\Model;

class ZonaCobertura extends Model
{
    protected $table = 'Zona';
    protected $primaryKey = 'idZona';
    public $timestamps = false;

    public const ESTADOS_COBERTURA = [
        'Disponible',
        'Parcial',
        'Saturada',
        'En expansión',
    ];

    protected $fillable = [
        'idZona',
        'nombreZona',
        'descripcion',
        'estado',
        'codigo',
        'ciudad',
        'barrio',
        'tecnologia',
        'estadoCobertura',
        'capacidadNodos',
        'areaMapa',
        // alias
        'nombre',
        'activo',
        'estado_cobertura',
        'capacidad_nodos',
        'area_mapa',
    ];

    protected $casts = [
        'estado'          => 'boolean',
        'capacidadNodos'  => 'integer',
        'areaMapa'        => 'array',
        'area_mapa'       => 'array',
    ];

    protected $appends = [
        'id',
        'nombre',
        'activo',
        'estado_cobertura',
        'capacidad_nodos',
        'area_mapa',
    ];

    public function newEloquentBuilder($query)
    {
        return new class($query) extends \Illuminate\Database\Eloquent\Builder {
            public function where($column, $operator = null, $value = null, $boolean = 'and')
            {
                if (is_string($column)) {
                    $column = match ($column) {
                        'nombre' => 'nombreZona',
                        'activo' => 'estado',
                        'capacidad_nodos' => 'capacidadNodos',
                        'area_mapa' => 'areaMapa',
                        'estado_cobertura' => 'estadoCobertura',
                        default => $column,
                    };
                }
                return parent::where($column, $operator, $value, $boolean);
            }
        };
    }

    public function getIdAttribute(): ?int
    {
        return isset($this->attributes['idZona']) ? (int) $this->attributes['idZona'] : null;
    }

    public function getNombreAttribute(): ?string
    {
        return $this->attributes['nombreZona'] ?? null;
    }

    public function setNombreAttribute(?string $value): void
    {
        $this->attributes['nombreZona'] = $value;
    }

    public function getActivoAttribute(): ?bool
    {
        return isset($this->attributes['estado']) ? (bool) $this->attributes['estado'] : true;
    }

    public function setActivoAttribute($value): void
    {
        $this->attributes['estado'] = (bool) $value;
    }

    public function getCapacidadNodosAttribute(): ?int
    {
        return isset($this->attributes['capacidadNodos']) ? (int) $this->attributes['capacidadNodos'] : 100;
    }

    public function setCapacidadNodosAttribute($value): void
    {
        $this->attributes['capacidadNodos'] = $value;
    }

    public function getEstadoCoberturaAttribute(): ?string
    {
        return $this->attributes['estadoCobertura'] ?? null;
    }

    public function setEstadoCoberturaAttribute(?string $value): void
    {
        $this->attributes['estadoCobertura'] = $value;
    }

    public function getAreaMapaAttribute(): ?array
    {
        $val = $this->attributes['areaMapa'] ?? null;
        if (is_string($val)) {
            return json_decode($val, true);
        }
        return $val;
    }

    public function setAreaMapaAttribute($value): void
    {
        $this->attributes['areaMapa'] = is_array($value) ? json_encode($value) : $value;
    }
}
