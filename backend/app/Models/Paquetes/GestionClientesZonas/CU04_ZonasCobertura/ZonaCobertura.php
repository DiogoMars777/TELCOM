<?php

namespace App\Models\Paquetes\GestionClientesZonas\CU04_ZonasCobertura;

use Illuminate\Database\Eloquent\Model;

class ZonaCobertura extends Model
{
    protected $table = 'zonas_cobertura';

    /**
     * Estados de cobertura permitidos (validados también en el controlador).
     * Se guardan como texto, no como enum de PostgreSQL.
     */
    public const ESTADOS_COBERTURA = [
        'Disponible',
        'Parcial',
        'Saturada',
        'En expansión',
    ];

    protected $fillable = [
        'codigo',
        'nombre',
        'ciudad',
        'barrio',
        'tecnologia', // Fibra Óptica, Radioenlace, etc.
        'estado_cobertura', // Disponible, Parcial, Saturada, En expansión
        'capacidad_nodos',
        'area_mapa', // GeoJSON del polígono dibujado en el mapa
        'activo',
    ];

    protected $casts = [
        'capacidad_nodos' => 'integer',
        'activo'          => 'boolean',
        'area_mapa'       => 'array',
    ];
}
