<?php

namespace App\Http\Controllers\Paquetes\FacturacionCobranza\CU11_ConsultarHistorialPagos;

use App\Http\Controllers\Controller;
use App\Models\Paquetes\FacturacionCobranza\CU10_GestionarPagoMensualidad\MetodoPago;
use App\Models\Paquetes\FacturacionCobranza\CU11_ConsultarHistorialPagos\HistorialPago;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Traits\ApiResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class HistorialPagosController extends Controller
{
    use ApiResponse;

    private const RELACIONES = [
        'detalles.mensualidad.cliente',
        'detalles.mensualidad.servicio',
        'metodoPago',
        'cajero:idUsuario,nombreCompleto,nombreUsuario',
    ];

    public function index(Request $request): JsonResponse
    {
        $filtros = $request->validate([
            'buscar' => ['nullable', 'string', 'max:120'],
            'cliente_id' => ['nullable', 'integer', 'exists:Cliente,idCliente'],
            'servicio_id' => ['nullable', 'integer', 'exists:ServicioInternet,idServicio'],
            'metodo_pago' => ['nullable', 'string', 'max:50'],
            'periodo' => ['nullable', 'regex:/^\d{4}-(0[1-9]|1[0-2])$/'],
            'fecha_desde' => ['nullable', 'date'],
            'fecha_hasta' => ['nullable', 'date', 'after_or_equal:fecha_desde'],
            'por_pagina' => ['nullable', 'integer', Rule::in([10, 20, 50])],
        ]);

        $query = HistorialPago::query()->with(self::RELACIONES);

        if (! empty($filtros['buscar'])) {
            $termino = trim($filtros['buscar']);
            $query->where(function (Builder $pago) use ($termino) {
                $pago->where('numeroComprobante', 'like', "%{$termino}%")
                    ->orWhereHas('detalles.mensualidad.servicio', fn (Builder $servicio) =>
                        $servicio->where('codigoServicio', 'like', "%{$termino}%"))
                    ->orWhereHas('detalles.mensualidad.cliente', fn (Builder $cliente) =>
                        $cliente->where(function (Builder $datos) use ($termino) {
                            $datos->where('codigoCliente', 'like', "%{$termino}%")
                                ->orWhere('nombreCompleto', 'like', "%{$termino}%")
                                ->orWhere('ci', 'like', "%{$termino}%");
                        }));
            });
        }

        if (! empty($filtros['cliente_id'])) {
            $query->porCliente((int) $filtros['cliente_id']);
        }
        if (! empty($filtros['servicio_id'])) {
            $query->porServicio((int) $filtros['servicio_id']);
        }
        if (! empty($filtros['metodo_pago'])) {
            $query->whereHas('metodoPago', fn (Builder $metodo) =>
                $metodo->where('nombreMetodo', strtoupper($filtros['metodo_pago'])));
        }
        if (! empty($filtros['periodo'])) {
            $query->whereHas('detalles.mensualidad', fn (Builder $mensualidad) =>
                $mensualidad->where('periodo', $filtros['periodo']));
        }
        if (! empty($filtros['fecha_desde'])) {
            $query->whereDate('fechaHora', '>=', $filtros['fecha_desde']);
        }
        if (! empty($filtros['fecha_hasta'])) {
            $query->whereDate('fechaHora', '<=', $filtros['fecha_hasta']);
        }

        $pagos = $query->orderByDesc('fechaHora')
            ->paginate($filtros['por_pagina'] ?? 20)
            ->withQueryString();

        return $this->success($pagos, 'Historial de pagos consultado correctamente.');
    }

    public function filtros(): JsonResponse
    {
        $servicios = ServicioInternet::query()
            ->with('cliente:idCliente,codigoCliente,nombreCompleto,ci')
            ->orderBy('codigoServicio')
            ->get()
            ->map(fn (ServicioInternet $servicio) => [
                'id' => $servicio->idServicio,
                'codigo' => $servicio->codigoServicio ?: "SRV-{$servicio->idServicio}",
                'cliente_id' => $servicio->idCliente,
                'cliente_codigo' => $servicio->cliente?->codigoCliente,
                'cliente_nombre' => $servicio->cliente?->nombreCompleto,
                'cliente_ci' => $servicio->cliente?->ci,
            ])->values();

        $metodos = MetodoPago::query()->where('estado', true)
            ->orderBy('nombreMetodo')->pluck('nombreMetodo')->values();

        return $this->success(compact('servicios', 'metodos'), 'Filtros disponibles recuperados correctamente.');
    }

    public function show(int $id): JsonResponse
    {
        $pago = HistorialPago::with(self::RELACIONES)->findOrFail($id);
        return $this->success($pago, 'Detalle del pago recuperado correctamente.');
    }
}
