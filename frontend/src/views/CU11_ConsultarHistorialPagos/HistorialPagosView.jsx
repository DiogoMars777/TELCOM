import React from 'react';
import { useHistorialPagosController } from '../../controllers/CU11_ConsultarHistorialPagos/useHistorialPagosController';
import { History, Filter, Receipt, Calendar } from 'lucide-react';

export default function HistorialPagosView() {
  const {
    pagos,
    loading,
    metodoFiltro,
    setMetodoFiltro,
  } = useHistorialPagosController();

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>CU11: Consultar Historial de Pagos</h2>
          <p className="subtitle">Auditoría de recaudaciones, transacciones bancarias y comprobantes emitidos</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-item">
          <Filter size={16} />
          <select value={metodoFiltro} onChange={(e) => setMetodoFiltro(e.target.value)}>
            <option value="">Todos los Métodos de Pago</option>
            <option value="QR">Código QR</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="TARJETA">Tarjeta</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nº Recibo</th>
              <th>Factura</th>
              <th>Cliente</th>
              <th>Monto Pagado</th>
              <th>Método</th>
              <th>Nº Transacción</th>
              <th>Fecha y Hora</th>
              <th>Cajero</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.codigo_recibo}</strong></td>
                <td>{p.factura_codigo}</td>
                <td>{p.cliente_nombre}</td>
                <td><strong className="text-success">Bs. {p.monto_pagado}</strong></td>
                <td><span className="badge badge-info">{p.metodo_pago}</span></td>
                <td><code>{p.numero_transaccion}</code></td>
                <td>{p.fecha_pago}</td>
                <td>{p.cajero_nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
