import React from 'react';
import { useMensualidadGeneracionController } from '../../controllers/CU09_GenerarMensualidades/useMensualidadGeneracionController';
import { hasPermission } from '../../config/access.js';
import { Calendar, PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MensualidadGeneracionView({ user }) {
  const {
    mensualidades,
    periodo,
    setPeriodo,
    loading,
    error,
    resultMsg,
    handleGenerar,
  } = useMensualidadGeneracionController();

  // La consulta (`mensualidades.view`) sigue visible; la ejecución masiva
  // solo se ofrece a quien posee `mensualidades.generate`.
  const puedeGenerar = hasPermission(user, 'mensualidades.generate');

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>CU09: Generar Mensualidades de Servicios</h2>
          <p className="subtitle">Motor de facturación periódica recurrente y emisión de deudas por contrato</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} /> No se pudieron cargar las mensualidades: {error}
        </div>
      )}

      {resultMsg && (
        <div className={`alert alert-${resultMsg.type}`} role="alert">
          {resultMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {resultMsg.text}
        </div>
      )}

      <div className="process-bar">
        <div className="process-group">
          <label><Calendar size={16} /> Período a Generar (AAAA-MM):</label>
          <input
            type="month"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={handleGenerar}
          disabled={loading || !puedeGenerar}
          title={puedeGenerar ? undefined : 'No tienes permiso mensualidades.generate'}
        >
          <PlayCircle size={18} /> {loading ? 'Ejecutando...' : 'Ejecutar Facturación Masiva'}
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Abonado</th>
              <th>Servicio</th>
              <th>Período</th>
              <th>Monto Facturado</th>
              <th>Emisión</th>
              <th>Vencimiento</th>
              <th>Estado Pago</th>
            </tr>
          </thead>
          <tbody>
            {mensualidades.map((m) => (
              <tr key={m.id}>
                <td><strong>{m.codigo_factura}</strong></td>
                <td>{m.cliente_nombre}</td>
                <td><span className="badge badge-info">{m.servicio_codigo}</span></td>
                <td>{m.periodo}</td>
                <td><strong>Bs. {m.monto}</strong></td>
                <td>{m.fecha_emision}</td>
                <td>{m.fecha_vencimiento}</td>
                <td>
                  <span className={`badge badge-${m.estado_pago === 'PAGADO' ? 'success' : 'danger'}`}>
                    {m.estado_pago}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
