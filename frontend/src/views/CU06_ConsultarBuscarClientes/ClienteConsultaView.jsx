import React from 'react';
import { useClienteConsultaController } from '../../controllers/CU06_ConsultarBuscarClientes/useClienteConsultaController';
import { Search, UserCheck, Phone, Mail, MapPin, Filter } from 'lucide-react';

export default function ClienteConsultaView() {
  const {
    clientes,
    loading,
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
  } = useClienteConsultaController();

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>CU06: Consultar y Buscar Clientes</h2>
          <p className="subtitle">Búsqueda rápida por CI, código, nombres o contacto</p>
        </div>
      </div>

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
                  <small className="text-muted">{c.zona_nombre || 'Zona Norte'}</small>
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
