import React from 'react';
import { useUsuarioController } from '../../controllers/CU03_UsuariosRolesPermisos/useUsuarioController';
import { Users, UserPlus, Shield, CheckCircle2 } from 'lucide-react';

export default function UsuariosView() {
  const {
    usuarios,
    loading,
    showModal,
    setShowModal,
    newUser,
    setNewUser,
    handleCreate,
  } = useUsuarioController();

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>CU03: Gestionar Usuarios Internos, Roles y Permisos</h2>
          <p className="subtitle">Administración de credenciales de operadores, técnicos y cajeros</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={16} /> Nuevo Usuario
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Correo Electrónico</th>
              <th>Rol Asignado</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>
                  <span className="badge badge-primary">
                    <Shield size={12} /> {u.role || 'Operador'}
                  </span>
                </td>
                <td>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> Activo
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
            <h3>Registrar Usuario Interno</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Ej. Roberto Gómez"
                />
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="usuario@telcom.com"
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="Administrador de Sistema">Administrador de Sistema</option>
                  <option value="Cajero / Cobranzas">Cajero / Cobranzas</option>
                  <option value="Soporte Técnico">Soporte Técnico</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
