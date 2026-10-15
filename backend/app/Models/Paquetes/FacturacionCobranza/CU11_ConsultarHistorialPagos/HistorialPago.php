<?php

namespace App\Models\Paquetes\FacturacionCobranza\CU11_ConsultarHistorialPagos;

use App\Models\Paquetes\FacturacionCobranza\CU10_GestionarPagoMensualidad\PagoMensualidad;

class HistorialPago extends PagoMensualidad
{
    /**
     * Scope para filtrar historial por rango de fechas y cliente
     */
    public function scopePorCliente($query, int $clienteId)
    {
        return $query->whereHas('mensualidad', function ($q) use ($clienteId) {
            $q->where('cliente_id', $clienteId);
        });
    }
}
