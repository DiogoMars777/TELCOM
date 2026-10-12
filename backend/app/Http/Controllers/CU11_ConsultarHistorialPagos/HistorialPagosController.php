<?php

namespace App\Http\Controllers\CU11_ConsultarHistorialPagos;

use App\Http\Controllers\Controller;
use App\Models\CU11_ConsultarHistorialPagos\HistorialPago;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HistorialPagosController extends Controller
{
    use ApiResponse;

    /**
     * CU11 - Consultar historial de pagos con filtros avanzados
     */
    public function index(Request $request): JsonResponse
    {
        $query = HistorialPago::with(['mensualidad.cliente', 'cajero:id,name']);

        if ($request->filled('cliente_id')) {
            $query->porCliente($request->integer('cliente_id'));
        }

        if ($request->filled('metodo_pago')) {
            $query->where('metodo_pago', $request->input('metodo_pago'));
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha_pago', '>=', $request->input('fecha_desde'));
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha_pago', '<=', $request->input('fecha_hasta'));
        }

        $pagos = $query->latest('fecha_pago')->paginate(20);

        return $this->success($pagos, 'Historial de pagos consultado correctamente.');
    }
}
