import React from 'react';
import { useClienteConsultaController } from '../../../../controllers/Paquetes/GestionClientesZonas/CU06_ConsultarBuscarClientes/useClienteConsultaController';
import { Search, UserCheck, Phone, Mail, MapPin, Filter, AlertCircle, RefreshCw } from 'lucide-react';

export default function ClienteConsultaView() {
  const {
    clientes,
    loading,
    error,
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
  } = useClienteConsultaController();

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>Consultar y Buscar Clientes</h2>
          <p className="subtitle">Búsqueda rápida por CI, código, nombres o contacto</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} /> No se pudo consultar los clientes: {error}
        </div>
      )}

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por Nombre, CI, Teléfono o Código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <Filter size={16} />
          <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Todos los Estados</option>
            <option value="ACTIVO">ACTIVO</option>
            <option value="SUSPENDIDO">SUSPENDIDO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Documento</th>
              <th>Abonado / Cliente</th>
              <th>Contacto</th>
              <th>Dirección / Zona</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <RefreshCw size={16} className="spin" /> Cargando clientes…
                </td>
              </tr>
            )}
            {!loading && clientes.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>Sin registros</td>
              </tr>
            )}
            {clientes.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.codigo_cliente}</strong></td>
                <td>{c.documento_identidad}</td>
                <td>
                  <strong>{c.nombres} {c.apellidos}</strong>
                </td>
                <td>
                  <div><Phone size={12} /> {c.telefono}</div>
                  <small><Mail size={12} /> {c.email}</small>
                </td>
                <td>
                  <div><MapPin size={12} /> {c.direccion}</div>
                  <small className="text-muted">{c.zona_nombre || '—'}</small>
                </td>
                <td>
                  <span className={`badge badge-${c.estado === 'ACTIVO' ? 'success' : 'warning'}`}>
                    {c.estado}
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
