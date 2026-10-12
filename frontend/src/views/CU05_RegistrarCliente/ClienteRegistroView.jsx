import React from 'react';
import { useClienteRegistroController } from '../../controllers/CU05_RegistrarCliente/useClienteRegistroController';
import { UserPlus, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function ClienteRegistroView({ onClienteCreated }) {
  const {
    cliente,
    loading,
    successMsg,
    errorMsg,
    handleChange,
    handleSubmit,
  } = useClienteRegistroController(onClienteCreated);

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>CU05: Registrar Nuevo Cliente</h2>
          <p className="subtitle">Formulario de afiliación e ingreso de abonado al sistema de telecomunicaciones</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de Documento</label>
              <select name="tipo_documento" value={cliente.tipo_documento} onChange={handleChange}>
                <option value="CI">Cédula de Identidad (CI)</option>
                <option value="NIT">NIT (Empresarial)</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nº de Documento</label>
              <input
                type="text"
                name="documento_identidad"
                required
                placeholder="Ej. 8492019"
                value={cliente.documento_identidad}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Nombres</label>
              <input
                type="text"
                name="nombres"
                required
                placeholder="Ej. Carlos Andrés"
                value={cliente.nombres}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Apellidos</label>
              <input
                type="text"
                name="apellidos"
                required
                placeholder="Ej. Mendoza Paredes"
                value={cliente.apellidos}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Teléfono / Celular</label>
              <input
                type="text"
                name="telefono"
                required
                placeholder="+591 76543210"
                value={cliente.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                required
                placeholder="carlos.mendoza@email.com"
                value={cliente.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Dirección de Domicilio</label>
              <input
                type="text"
                name="direccion"
                required
                placeholder="Av. Principal #742, Barrio Equipetrol"
                value={cliente.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Zona de Cobertura</label>
              <select name="zona_id" value={cliente.zona_id} onChange={handleChange}>
                <option value={1}>Zona Norte - Fibra Troncal</option>
                <option value={2}>Zona Sur - Anillo Metropolitano</option>
                <option value={3}>Zona Central - Casco Viejo</option>
              </select>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} /> {loading ? 'Registrando...' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
