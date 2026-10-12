import React from 'react';
import { useServicioInternetController } from '../../controllers/CU08_RegistrarActivarServicio/useServicioInternetController';
import { Wifi, Plus, Zap, CheckCircle2, Clock } from 'lucide-react';

export default function ServicioInternetView() {
  const {
    servicios,
    loading,
    showModal,
    setShowModal,
    showActivarModal,
    setShowActivarModal,
    selectedServicio,
    setSelectedServicio,
    formServicio,
    setFormServicio,
    formActivar,
    setFormActivar,
    handleCrear,
    handleActivar,
  } = useServicioInternetController();

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>CU08: Registrar y Activar Servicio de Internet</h2>
          <p className="subtitle">Contratación de planes FTTH y comisionamiento técnico de ONTs / Routers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Contratar Servicio
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código Servicio</th>
              <th>Cliente</th>
              <th>Plan Contratado</th>
              <th>Velocidad</th>
              <th>Tarifa Mensual</th>
              <th>Parámetros Red</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.codigo_servicio}</strong></td>
                <td>{s.cliente_nombre || 'Carlos Andrés Mendoza'}</td>
                <td>{s.plan_nombre}</td>
                <td><span className="badge badge-info">{s.velocidad_mbps} Mbps</span></td>
                <td>Bs. {s.precio_mensual}</td>
                <td>
                  {s.ip_asignada ? (
                    <div>
                      <small>IP: <code>{s.ip_asignada}</code></small><br/>
                      <small>MAC: <code>{s.mac_router}</code></small>
                    </div>
                  ) : (
                    <span className="text-muted">Sin IP/MAC</span>
                  )}
                </td>
                <td>
                  <span className={`badge badge-${s.estado_servicio === 'ACTIVO' ? 'success' : 'warning'}`}>
                    {s.estado_servicio}
                  </span>
                </td>
                <td>
                  {s.estado_servicio === 'PENDIENTE_INSTALACION' && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setSelectedServicio(s);
                        setShowActivarModal(true);
                      }}
                    >
                      <Zap size={14} /> Activar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Contratar Nuevo Servicio de Internet</h3>
            <form onSubmit={handleCrear}>
              <div className="form-group">
                <label>Plan de Internet</label>
                <select
                  value={formServicio.plan_nombre}
                  onChange={(e) => setFormServicio({ ...formServicio, plan_nombre: e.target.value })}
                >
                  <option value="Plan Básico 30 Mbps">Plan Básico 30 Mbps - Bs. 130</option>
                  <option value="Plan Hogar Plus 50 Mbps">Plan Hogar Plus 50 Mbps - Bs. 160</option>
                  <option value="Plan Fibra Ultra 100 Mbps">Plan Fibra Ultra 100 Mbps - Bs. 220</option>
                  <option value="Plan Corporativo 300 Mbps">Plan Corporativo 300 Mbps - Bs. 450</option>
                </select>
              </div>
              <div className="form-group">
                <label>Velocidad (Mbps)</label>
                <input
                  type="number"
                  value={formServicio.velocidad_mbps}
                  onChange={(e) => setFormServicio({ ...formServicio, velocidad_mbps: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>Precio Mensual (Bs.)</label>
                <input
                  type="number"
                  value={formServicio.precio_mensual}
                  onChange={(e) => setFormServicio({ ...formServicio, precio_mensual: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>Día de Corte Mensual</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={formServicio.dia_corte}
                  onChange={(e) => setFormServicio({ ...formServicio, dia_corte: parseInt(e.target.value) || 10 })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>Guardar Solicitud</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showActivarModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Activar Servicio Técnicamente</h3>
            <p>Asignación de IP fija / dinámica y MAC de la ONT de cliente.</p>
            <form onSubmit={handleActivar}>
              <div className="form-group">
                <label>Dirección IP Asignada</label>
                <input
                  type="text"
                  required
                  value={formActivar.ip_asignada}
                  onChange={(e) => setFormActivar({ ...formActivar, ip_asignada: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>MAC del Router / ONT</label>
                <input
                  type="text"
                  required
                  value={formActivar.mac_router}
                  onChange={(e) => setFormActivar({ ...formActivar, mac_router: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowActivarModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-success" disabled={loading}>Confirmar Activación</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
