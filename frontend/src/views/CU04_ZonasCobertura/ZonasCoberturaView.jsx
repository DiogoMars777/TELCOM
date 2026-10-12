import React from 'react';
import { useZonaCoberturaController } from '../../controllers/CU04_ZonasCobertura/useZonaCoberturaController';
import { MapPin, Plus, Radio, Cpu } from 'lucide-react';

export default function ZonasCoberturaView() {
  const {
    zonas,
    loading,
    showModal,
    setShowModal,
    newZona,
    setNewZona,
    handleCreate,
  } = useZonaCoberturaController();

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>CU04: Gestionar Zonas de Cobertura</h2>
          <p className="subtitle">Mapeo de infraestructura de fibra y nodos para telecomunicaciones</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Nueva Zona
        </button>
      </div>

      <div className="grid-cards">
        {zonas.map((z) => (
          <div key={z.id} className="card-item">
            <div className="card-item-header">
              <span className="badge badge-info">{z.codigo}</span>
              <span className="badge badge-success">Activo</span>
            </div>
            <h3>{z.nombre}</h3>
            <p className="location-text"><MapPin size={14} /> {z.ciudad}</p>
            <div className="tech-info">
              <div><Radio size={14} /> Tecnología: <strong>{z.tecnologia}</strong></div>
              <div><Cpu size={14} /> Capacidad Nodos: <strong>{z.capacidad_nodos} clientes</strong></div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Registrar Zona de Cobertura</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Código de Zona</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. ZON-ESTE"
                  value={newZona.codigo}
                  onChange={(e) => setNewZona({ ...newZona, codigo: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Nombre de Zona</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Anillo Este - Radial 10"
                  value={newZona.nombre}
                  onChange={(e) => setNewZona({ ...newZona, nombre: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Ciudad</label>
                <input
                  type="text"
                  required
                  value={newZona.ciudad}
                  onChange={(e) => setNewZona({ ...newZona, ciudad: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tecnología</label>
                <select
                  value={newZona.tecnologia}
                  onChange={(e) => setNewZona({ ...newZona, tecnologia: e.target.value })}
                >
                  <option value="FTTH GPON">FTTH GPON (Fibra Óptica)</option>
                  <option value="HFC">HFC (Coaxial)</option>
                  <option value="Radioenlace 5GHz">Radioenlace 5GHz / Microondas</option>
                </select>
              </div>
              <div className="form-group">
                <label>Capacidad Nodos</label>
                <input
                  type="number"
                  required
                  value={newZona.capacidad_nodos}
                  onChange={(e) => setNewZona({ ...newZona, capacidad_nodos: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>Guardar Zona</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
