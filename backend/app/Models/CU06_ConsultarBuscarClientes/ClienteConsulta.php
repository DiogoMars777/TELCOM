<?php

namespace App\Models\CU06_ConsultarBuscarClientes;

use App\Models\CU05_RegistrarCliente\Cliente;

class ClienteConsulta extends Cliente
{
    /**
     * Scope para búsqueda avanzada de clientes por criterio múltiple
     */
    public function scopeBuscar($query, ?string $termino)
    {
        if (empty($termino)) {
            return $query;
        }

        return $query->where(function ($q) use ($termino) {
            $q->where('codigo_cliente', 'ILIKE', "%{$termino}%")
              ->orWhere('documento_identidad', 'ILIKE', "%{$termino}%")
              ->orWhere('nombres', 'ILIKE', "%{$termino}%")
              ->orWhere('apellidos', 'ILIKE', "%{$termino}%")
              ->orWhere('email', 'ILIKE', "%{$termino}%")
              ->orWhere('telefono', 'ILIKE', "%{$termino}%");
        });
    }
}
