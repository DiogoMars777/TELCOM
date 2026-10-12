<?php

namespace App\Models\CU13_ListadoServiciosCorte;

use App\Models\CU08_RegistrarActivarServicio\ServicioInternet;

class ServicioParaCorte extends ServicioInternet
{
    /**
     * Scope para identificar servicios elegibles para corte por mora
     */
    public function scopeElegiblesParaCorte($query, int $diasTolerancia = 5)
    {
        return $query->where('estado_servicio', 'ACTIVO')
            ->whereHas('mensualidad', function ($q) use ($diasTolerancia) {
                $q->where('estado_pago', '!=', 'PAGADO')
                  ->where('fecha_vencimiento', '<=', now()->subDays($diasTolerancia));
            });
    }
}
