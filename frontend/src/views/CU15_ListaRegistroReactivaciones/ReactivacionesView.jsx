import React from 'react';
import { useReactivacionesController } from '../../controllers/CU15_ListaRegistroReactivaciones/useReactivacionesController';
import { RefreshCw, Play, CheckCircle2, DollarSign } from 'lucide-react';

export default function ReactivacionesView() {
  const {
    reactivaciones,
    loading,
    showModal,
    setShowModal,
    formReactivacion,
    setFormReactivacion,
    handleCrear,
  } = useReactivacionesController();

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>CU15: Gestionar Lista y Registro de Reactivaciones</h2>
          <p className="subtitle">Reposición de enlace para clientes normalizados y control de cobro de reconexión</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Play size={16} /> Registrar Reactivación
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Servicio</th>
              <th>Cliente</th>
              <th>Costo Reconexión</th>
              <th>Fecha / Hora</th>
              <th>Operador</th>
              <th>Observaciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reactivaciones.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.codigo_reactivacion}</strong></td>
                <td><span className="badge badge-info">{r.servicio_codigo}</span></td>
                <td>{r.cliente_nombre}</td>
                <td><strong>Bs. {r.costo_reactivacion}</strong></td>
                <td>{r.fecha_reactivacion}</td>
                <td>{r.operador_nombre}</td>
                <td>{r.observaciones}</td>
                <td>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> REACTIVADO
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Registrar Reactivación de Servicio</h3>
            <form onSubmit={handleCrear}>
              <div className="form-group">
                <label>Servicio a Reactivar</label>
                <select
                  value={formReactivacion.servicio_id}
                  onChange={(e) => setFormReactivacion({ ...formReactivacion, servicio_id: parseInt(e.target.value) || 1 })}
                >
                  <option value={1}>SRV-88201 - Fernando Torres (Cortado por Mora)</option>
                  <option value={2}>SRV-88204 - Juan Pablo Camacho (Cortado)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Costo de Reconexión (Bs.)</label>
                <input
                  type="number"
                  value={formReactivacion.costo_reactivacion}
                  onChange={(e) => setFormReactivacion({ ...formReactivacion, costo_reactivacion: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  rows={3}
                  value={formReactivacion.observaciones}
                  onChange={(e) => setFormReactivacion({ ...formReactivacion, observaciones: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>Confirmar Reactivación</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
