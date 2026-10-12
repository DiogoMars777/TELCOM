import React from 'react';
import { useAuthController } from '../../controllers/CU01_IniciarCerrarSesion/useAuthController';
import { ShieldCheck, LogIn, Lock, Mail, Radio } from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const {
    credentials,
    loading,
    error,
    handleChange,
    handleSubmit,
  } = useAuthController(onLoginSuccess);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-header">
          <div className="brand-icon">
            <Radio size={32} />
          </div>
          <h2>TELCOM NETWORKS</h2>
          <span className="badge badge-info">CU01: Iniciar y Cerrar Sesión</span>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><Mail size={16} /> Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="admin@telcom.com"
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> Contraseña</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Validando...' : (
              <>
                <LogIn size={18} /> Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p><ShieldCheck size={14} /> Autenticación segura con Laravel Sanctum & PostgreSQL</p>
        </div>
      </div>
    </div>
  );
}
