<?php

namespace App\Models\CU04_ZonasCobertura;

use Illuminate\Database\Eloquent\Model;

class ZonaCobertura extends Model
{
    protected $table = 'zonas_cobertura';

    protected $fillable = [
        'codigo',
        'nombre',
        'ciudad',
        'tecnologia', // Fibra Óptica, Radioenlace, etc.
        'capacidad_nodos',
        'activo',
    ];

    protected $casts = [
        'capacidad_nodos' => 'integer',
        'activo'          => 'boolean',
    ];
}
