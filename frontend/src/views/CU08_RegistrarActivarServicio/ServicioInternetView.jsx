import React from 'react';
import { useServicioInternetController } from '../../controllers/CU08_RegistrarActivarServicio/useServicioInternetController';
import { hasPermission } from '../../config/access.js';
import { Plus, Zap, AlertCircle, RefreshCw } from 'lucide-react';

export default function ServicioInternetView({ user }) {
  const {
    servicios,
    loading,
    error,
    formError,
    showModal,
    setShowModal,
    showActivarModal,
    setShowActivarModal,
    setSelectedServicio,
    clientes,
    planes,
    catalogError,
    formServicio,
    setFormServicio,
    formActivar,
    setFormActivar,
    handleClienteChange,
    handlePlanChange,
    handleCrear,
    handleActivar,
  } = useServicioInternetController();

  // Solo la interfaz; el backend aplica el permiso real (`servicios.manage`).
  const puedeGestionar = hasPermission(user, 'servicios.manage');

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>CU08: Registrar / Activar Servicio</h2>
          <p className="subtitle">Contratación de planes de fibra y activación técnica de equipos en red</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          disabled={!puedeGestionar}
          title={puedeGestionar ? undefined : 'No tienes permiso servicios.manage'}
        >
          <Plus size={16} /> Contratar Servicio
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} /> No se pudo cargar la lista de servicios: {error}
        </div>
      )}

      {catalogError && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} /> No se pudieron cargar clientes y planes: {catalogError}
        </div>
      )}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código Servicio</th>
              <th>Cliente</th>
              <th>Plan Contratado</th>
              <th>Velocidad</th>
              <th>Tarifa Mensual</th>
              <th>Parámetros de Red</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <RefreshCw size={16} className="spin" /> Cargando servicios…
                </td>
              </tr>
            )}
            {!loading && servicios.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8' }}>Sin registros</td>
              </tr>
            )}
            {servicios.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.codigo_servicio}</strong></td>
                <td>{s.cliente_nombre || '—'}</td>
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
                    <span style={{ color: '#94a3b8' }}>Sin IP/MAC</span>
                  )}
                </td>
                <td>
                  <span className={`badge badge-${s.estado_servicio === 'ACTIVO' ? 'success' : 'warning'}`}>
                    {s.estado_servicio}
                  </span>
                </td>
                <td>
                  {s.estado_servicio === 'PENDIENTE_INSTALACION' && puedeGestionar && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setSelectedServicio(s);
                        setFormActivar({ ip_asignada: '', mac_router: '' });
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
            <h3>Contratar Nuevo Servicio</h3>
            <form onSubmit={handleCrear}>
              <div className="form-group">
                <label>Cliente</label>
                <select
                  required
                  value={formServicio.cliente_id}
                  onChange={(e) => handleClienteChange(e.target.value)}
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombres} {c.apellidos} — {c.codigo_cliente}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Plan de Internet</label>
                <select
                  required
                  value={formServicio.plan_id}
                  onChange={(e) => handlePlanChange(e.target.value)}
                >
                  <option value="">Seleccione un plan</option>
                  {planes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre_plan} — Bs. {p.precio_mensual}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Velocidad (Mbps)</label>
                <input
                  type="number"
                  required
                  value={formServicio.velocidad_mbps}
                  onChange={(e) => setFormServicio({ ...formServicio, velocidad_mbps: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Precio Mensual (Bs.)</label>
                <input
                  type="number"
                  required
                  value={formServicio.precio_mensual}
                  onChange={(e) => setFormServicio({ ...formServicio, precio_mensual: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Dirección de Instalación</label>
                <input
                  type="text"
                  required
                  value={formServicio.direccion_instalacion}
                  onChange={(e) => setFormServicio({ ...formServicio, direccion_instalacion: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Día de Corte Mensual</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  required
                  value={formServicio.dia_corte}
                  onChange={(e) => setFormServicio({ ...formServicio, dia_corte: e.target.value })}
                />
              </div>
              {formError && (
                <div className="alert alert-danger" role="alert">
                  <AlertCircle size={18} /> {formError}
                </div>
              )}
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
              {formError && (
                <div className="alert alert-danger" role="alert">
                  <AlertCircle size={18} /> {formError}
                </div>
              )}
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
