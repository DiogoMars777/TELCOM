import React, { useState } from 'react';
import { Wifi, Lock, Mail, ShieldCheck, Users, RefreshCw, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuthController } from '../../../../controllers/Paquetes/SeguridadAdministracion/CU01_IniciarCerrarSesion/useAuthController';
import { authService } from '../../../../models/Paquetes/SeguridadAdministracion/CU01_IniciarCerrarSesion/authModel';
import { evaluatePassword } from '../../../../config/passwordPolicy';
import { siteConfig } from '../../../../config/siteConfig';
import './login.css';

// Año actual calculado una sola vez (fuera del render).
const CURRENT_YEAR = new Date().getFullYear();

/* ---- Iconos para mostrar/ocultar contraseña (SVG propios) ---- */
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
      <path d="M9.9 5.2A9.7 9.7 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.1 3.9" />
      <path d="M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 4.1-.9" />
    </svg>
  );
}

/* ---- Composición visual: fibra óptica / infraestructura de red ---- */
function LeftVisual() {
  if (siteConfig.portal.image) {
    return <img className="emp-left-visual" src={siteConfig.portal.image} alt="" aria-hidden="true" />;
  }

  return (
    <svg
      className="emp-left-visual"
      viewBox="0 0 420 620"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="empLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fd3ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#2f80ed" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="url(#empLine)" strokeWidth="1.5">
        <path d="M-20 90 C 120 140, 190 70, 440 150" />
        <path d="M-20 250 C 120 300, 200 190, 440 280" />
        <path d="M-20 430 C 130 470, 210 380, 440 470" />
        <path d="M120 -20 C 170 160, 90 300, 190 640" />
        <path d="M310 -20 C 250 180, 340 320, 260 640" />
      </g>

      <g fill="#7fd3ff">
        <circle cx="120" cy="138" r="3.5" opacity="0.9" />
        <circle cx="300" cy="120" r="2.8" opacity="0.7" />
        <circle cx="200" cy="300" r="3.2" opacity="0.8" />
        <circle cx="320" cy="430" r="3" opacity="0.7" />
        <circle cx="90" cy="440" r="2.6" opacity="0.6" />
      </g>
    </svg>
  );
}

/* ---- Iconos de los tres bloques informativos ---- */
const FEATURE_ICONS = {
  seguridad: ShieldCheck,
  roles: Users,
  correo: Mail,
};

export default function LoginView({ onLoginSuccess, onBack }) {
  const { credentials, loading, error, handleChange, handleSubmit } =
    useAuthController(onLoginSuccess);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  // const [resendCooldown, setResendCooldown] = useState(0); // reservado para reenvío si backend lo limita
  const { portal, brand } = siteConfig;

  return (
    <div className="emp-root">
      <div className="emp-card">
        {/* ------------------ Panel izquierdo ------------------ */}
        <section className="emp-left">
          <LeftVisual />

          <div className="emp-brand">
            <span className="emp-brand-mark">
              <Wifi size={18} />
            </span>
            {brand.name}
            <span className="emp-dot">.</span>
          </div>

          <div className="emp-left-copy">
            <h1>{portal.title}</h1>
            <p>{portal.description}</p>
          </div>

          <div className="emp-features">
            {portal.features.map((feature) => {
              const Icon = FEATURE_ICONS[feature.id] || ShieldCheck;
              return (
                <div className="emp-feature" key={feature.id}>
                  <span className="emp-feature-icon">
                    <Icon size={18} />
                  </span>
                  <div>
                    <strong>{feature.title}</strong>
                    <span>{feature.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="emp-left-foot">
            © {CURRENT_YEAR} {brand.name}. Todos los derechos reservados.
          </div>
        </section>

        {/* ------------------ Panel derecho ------------------ */}
        <section className="emp-right">
          <div className="emp-form-wrap">
            <div className="emp-form-head">
              <div className="emp-form-icon">
                <Wifi size={26} />
              </div>
              <div className="emp-form-logo">
                {brand.name}
                <span className="emp-dot">.</span>
              </div>
              <p>{portal.subtitle}</p>
            </div>

            {error && (
              <div className="emp-alert">
                <ShieldCheck size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="emp-field">
                <label htmlFor="login-user">Nombre de Usuario</label>
                <div className="emp-input">
                  <Mail size={17} className="emp-input-icon" />
                  <input
                    id="login-user"
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="usuario@telcom.com"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="emp-field">
                <label htmlFor="login-password">Contraseña</label>
                <div className="emp-input has-toggle">
                  <Lock size={17} className="emp-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="emp-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="emp-row-link">
                <button
                  type="button"
                  className="emp-link"
                  onClick={() => {
                    setForgotStep('email');
                    setForgotEmail(credentials.email || '');
                    setForgotCode('');
                    setNewPass('');
                    setNewPassConfirm('');
                    setForgotError('');
                    setForgotSuccess('');
                  }}
                >
                  {portal.forgotLabel}
                </button>
              </div>

              <button type="submit" className="emp-submit" disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw size={17} className="emp-spin" /> Verificando…
                  </>
                ) : (
                  <>
                    <Lock size={17} /> Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {forgotStep !== 'login' && (
              <div className="emp-forgot" style={{ marginTop: '1rem', width: '100%' }}>
                {forgotStep === 'email' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setForgotLoading(true);
                      setForgotError('');
                      setForgotSuccess('');
                      try {
                        await authService.forgotPassword(forgotEmail);
                        setForgotSuccess('Si el correo existe, recibirás un código de verificación.');
                        setForgotStep('code');
                      } catch (err) {
                        setForgotError(err?.message || 'No se pudo enviar el código.');
                      } finally {
                        setForgotLoading(false);
                      }
                    }}
                  >
                    <div className="emp-field">
                      <label htmlFor="forgot-email">Correo electrónico</label>
                      <div className="emp-input">
                        <Mail size={17} className="emp-input-icon" />
                        <input
                          id="forgot-email"
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="usuario@telcom.com"
                          required
                        />
                      </div>
                    </div>
                    {forgotError && (
                      <div className="emp-alert" style={{ marginBottom: '0.75rem' }}>
                        <ShieldCheck size={16} /> {forgotError}
                      </div>
                    )}
                    {forgotSuccess && (
                      <div className="emp-info" style={{ marginBottom: '0.75rem' }}>
                        {forgotSuccess}
                      </div>
                    )}
                    <button type="submit" className="emp-submit" disabled={forgotLoading}>
                      {forgotLoading ? (
                        <>
                          <RefreshCw size={17} className="emp-spin" /> Enviando...
                        </>
                      ) : (
                        <>
                          <Mail size={17} /> Enviar código
                        </>
                      )}
                    </button>
                    <div className="emp-back" style={{ marginTop: '0.75rem' }}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setForgotStep('login');
                        }}
                      >
                        <ArrowLeft size={14} /> Volver al inicio de sesión
                      </a>
                    </div>
                  </form>
                )}
                {forgotStep === 'code' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setForgotStep('reset');
                    }}
                  >
                    <div className="emp-field">
                      <label htmlFor="forgot-code">Código de 6 dígitos</label>
                      <div className="emp-input">
                        <KeyRound size={17} className="emp-input-icon" />
                        <input
                          id="forgot-code"
                          type="text"
                          maxLength={6}
                          pattern="[0-9]{6}"
                          value={forgotCode}
                          onChange={(e) => setForgotCode(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="000000"
                          required
                        />
                      </div>
                    </div>
                    {forgotError && (
                      <div className="emp-alert" style={{ marginBottom: '0.75rem' }}>
                        <ShieldCheck size={16} /> {forgotError}
                      </div>
                    )}
                    <button type="submit" className="emp-submit">
                      Continuar
                    </button>
                    <div className="emp-back" style={{ marginTop: '0.75rem' }}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setForgotStep('email');
                        }}
                      >
                        <ArrowLeft size={14} /> Volver
                      </a>
                    </div>
                  </form>
                )}
                {forgotStep === 'reset' && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setForgotLoading(true);
                      setForgotError('');
                      setForgotSuccess('');
                      const policy = evaluatePassword(newPass);
                      const allMet = policy.every((r) => r.met);
                      if (!allMet) {
                        setForgotError('La nueva contraseña no cumple la política.');
                        setForgotLoading(false);
                        return;
                      }
                      if (newPass !== newPassConfirm) {
                        setForgotError('Las contraseñas no coinciden.');
                        setForgotLoading(false);
                        return;
                      }
                      try {
                        await authService.resetPassword({
                          email: forgotEmail,
                          code: forgotCode,
                          newPassword: newPass,
                          newPasswordConfirmation: newPassConfirm,
                        });
                        setForgotSuccess('Contraseña restablecida correctamente. Puedes iniciar sesión con la nueva contraseña.');
                        setForgotStep('success');
                      } catch (err) {
                        setForgotError(err?.message || 'No se pudo restablecer la contraseña.');
                      } finally {
                        setForgotLoading(false);
                      }
                    }}
                  >
                    <div className="emp-field">
                      <label htmlFor="new-pass">Nueva contraseña</label>
                      <div className="emp-input">
                        <Lock size={17} className="emp-input-icon" />
                        <input
                          id="new-pass"
                          type="password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>
                    <ul className="password-requirements" style={{ margin: '0 0 0.75rem 0', fontSize: '0.78rem' }}>
                      {evaluatePassword(newPass).map((req) => (
                        <li key={req.id} className={req.met ? 'is-met' : 'is-pending'} style={{ marginBottom: '0.25rem' }}>
                          {req.met ? <CheckCircle2 size={14} /> : <ShieldCheck size={14} />}
                          <span>{req.label}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="emp-field">
                      <label htmlFor="new-pass-confirm">Confirmar nueva contraseña</label>
                      <div className="emp-input">
                        <Lock size={17} className="emp-input-icon" />
                        <input
                          id="new-pass-confirm"
                          type="password"
                          value={newPassConfirm}
                          onChange={(e) => setNewPassConfirm(e.target.value)}
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>
                    {forgotError && (
                      <div className="emp-alert" style={{ marginBottom: '0.75rem' }}>
                        <ShieldCheck size={16} /> {forgotError}
                      </div>
                    )}
                    <button type="submit" className="emp-submit" disabled={forgotLoading}>
                      {forgotLoading ? (
                        <>
                          <RefreshCw size={17} className="emp-spin" /> Restableciendo...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={17} /> Restablecer contraseña
                        </>
                      )}
                    </button>
                    <div className="emp-back" style={{ marginTop: '0.75rem' }}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setForgotStep('code');
                        }}
                      >
                        <ArrowLeft size={14} /> Volver
                      </a>
                    </div>
                  </form>
                )}
                {forgotStep === 'success' && (
                  <div>
                    <p className="emp-info" style={{ marginBottom: '1rem' }}>
                      {forgotSuccess}
                    </p>
                    <button
                      type="button"
                      className="emp-submit"
                      onClick={() => {
                        setForgotStep('login');
                        setForgotCode('');
                        setNewPass('');
                        setNewPassConfirm('');
                        setForgotError('');
                        setForgotSuccess('');
                      }}
                    >
                      Volver al inicio de sesión
                    </button>
                  </div>
                )}
              </div>
            )}

            {onBack && (
              <div className="emp-back">
                <a
                  href="#volver"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  ← Volver al inicio
                </a>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
