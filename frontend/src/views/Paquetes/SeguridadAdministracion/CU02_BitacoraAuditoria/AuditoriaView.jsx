import React from 'react';
import { useAuditoriaController } from '../../../../controllers/Paquetes/SeguridadAdministracion/CU02_BitacoraAuditoria/useAuditoriaController';
import { History, Filter, RefreshCw, ShieldAlert, MonitorCheck, AlertCircle } from 'lucide-react';

export default function AuditoriaView() {
  const {
    logs,
    loading,
    error,
    moduloFiltro,
    setModuloFiltro,
    accionFiltro,
    setAccionFiltro,
    reload,
  } = useAuditoriaController();

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>Consultar Bitácora de Auditoría</h2>
          <p className="subtitle">Trazabilidad en tiempo real de operaciones críticas</p>
        </div>
        <button onClick={reload} className="btn btn-secondary" disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refrescar
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} /> No se pudo cargar la bitácora: {error}
        </div>
      )}

      <div className="filters-bar">
        <div className="filter-item">
          <Filter size={16} />
          <select value={moduloFiltro} onChange={(e) => setModuloFiltro(e.target.value)}>
            <option value="">Todos los Módulos</option>
            <option value="CU01_IniciarCerrarSesion">Autenticación</option>
            <option value="CU05_RegistrarCliente">Clientes</option>
            <option value="CU08_RegistrarActivarServicio">Servicios Internet</option>
            <option value="CU10_GestionarPagoMensualidad">Pagos</option>
            <option value="CU14_RegistrarCorteRealizado">Cortes</option>
          </select>
        </div>
        <div className="filter-item">
          <select value={accionFiltro} onChange={(e) => setAccionFiltro(e.target.value)}>
            <option value="">Todas las Acciones</option>
            <option value="ACTIVACION">ACTIVACION</option>
            <option value="REGISTRO_PAGO">REGISTRO_PAGO</option>
            <option value="CORTE_LOGICO">CORTE_LOGICO</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Módulo</th>
              <th>Acción</th>
              <th>Detalles Operación</th>
              <th>IP Origen</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>#{log.id}</td>
                <td>
                  <div className="user-cell">
                    <strong>{log.user?.name}</strong>
                    <small>{log.user?.email}</small>
                  </div>
                </td>
                <td><span className="badge badge-info">{log.modulo}</span></td>
                <td><span className="badge badge-warning">{log.accion}</span></td>
                <td>{log.detalles}</td>
                <td><code>{log.ip_origen}</code></td>
                <td>{log.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
