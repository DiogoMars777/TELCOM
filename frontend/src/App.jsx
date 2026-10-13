import React, { useEffect, useState } from 'react';

// Vistas públicas
import LandingView from './views/Public/LandingView';
import LoginView from './views/CU01_IniciarCerrarSesion/LoginView';
import SesionView from './views/CU01_IniciarCerrarSesion/SesionView';

// Vistas de los 15 Casos de Uso (módulos administrativos)
import AuditoriaView from './views/CU02_BitacoraAuditoria/AuditoriaView';
import UsuariosView from './views/CU03_UsuariosRolesPermisos/UsuariosView';
import ZonasCoberturaView from './views/CU04_ZonasCobertura/ZonasCoberturaView';
import ClienteRegistroView from './views/CU05_RegistrarCliente/ClienteRegistroView';
import ClienteConsultaView from './views/CU06_ConsultarBuscarClientes/ClienteConsultaView';
import ClienteMantenimientoView from './views/CU07_ActualizarBajaCliente/ClienteMantenimientoView';
import ServicioInternetView from './views/CU08_RegistrarActivarServicio/ServicioInternetView';
import MensualidadGeneracionView from './views/CU09_GenerarMensualidades/MensualidadGeneracionView';
import PagoMensualidadView from './views/CU10_GestionarPagoMensualidad/PagoMensualidadView';
import HistorialPagosView from './views/CU11_ConsultarHistorialPagos/HistorialPagosView';
import AlertasVencimientoView from './views/CU12_VisualizarAlertasVencimiento/AlertasVencimientoView';
import ServiciosCorteView from './views/CU13_ListadoServiciosCorte/ServiciosCorteView';
import CorteRegistroView from './views/CU14_RegistrarCorteRealizado/CorteRegistroView';
import ReactivacionesView from './views/CU15_ListaRegistroReactivaciones/ReactivacionesView';

// Iconos de cada Caso de Uso
import {
  Radio, LogIn, LogOut, History, Users, MapPin,
  UserPlus, Search, Edit3, Wifi, Calendar,
  CreditCard, Clock, AlertTriangle, Scissors, RefreshCw,
  Server, Database,
} from 'lucide-react';

import { authService } from './models/CU01_IniciarCerrarSesion/authModel';
import { canAccessCu, firstAllowedCu } from './config/access';

export default function App() {
  // 'landing' | 'login' | 'admin'
  const [view, setView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [activeCU, setActiveCU] = useState('CU06');
  const [corteServicioSelected, setCorteServicioSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthenticated = Boolean(currentUser);

  // Al iniciar: validar un token guardado (protección de rutas)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (authService.getToken()) {
        try {
          const user = await authService.fetchCurrentUser();
          if (mounted && user) {
            setCurrentUser(user);
            setView('admin');
          } else {
            authService.clear();
          }
        } catch (err) {
          if (err?.status === 401) {
            // Token inválido/expirado
            authService.clear();
          } else {
            // Sin conexión: conservar la sesión en caché para no expulsar al usuario.
            const cached = authService.getCurrentUser();
            if (mounted && cached) {
              setCurrentUser(cached);
              setView('admin');
            }
          }
        }
      }
      if (mounted) setBooting(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Si el token expira durante el uso, volver a la pantalla de acceso
  useEffect(() => {
    const onUnauthorized = () => {
      authService.clear();
      setCurrentUser(null);
      setActiveCU('CU01');
      setCorteServicioSelected(null);
      setView('login');
    };
    window.addEventListener('telcom:unauthorized', onUnauthorized);
    return () => window.removeEventListener('telcom:unauthorized', onUnauthorized);
  }, []);

  // Módulo efectivo: si `activeCU` deja de estar permitido para la sesión
  // actual (p. ej. por manipular el estado en el navegador), se deriva a uno
  // permitido durante el render. Nunca se renderiza un módulo sin permiso.
  // El backend sigue siendo quien autoriza de verdad.
  const effectiveCu = currentUser && canAccessCu(currentUser, activeCU)
    ? activeCU
    : firstAllowedCu(currentUser);

  const handleLoginSuccess = (user) => {
    const authed = user || authService.getCurrentUser();
    setCurrentUser(authed);
    setActiveCU(firstAllowedCu(authed));
    setSidebarOpen(false);
    setView('admin');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setActiveCU('CU01');
    setCorteServicioSelected(null);
    setSidebarOpen(false);
    setView('landing');
  };

  const menuSections = [
    {
      title: 'Seguridad & Auditoría',
      items: [
        { id: 'CU01', label: 'Mi Sesión', icon: LogIn },
        { id: 'CU02', label: 'Bitácora de Auditoría', icon: History },
        { id: 'CU03', label: 'Usuarios, Roles y Permisos', icon: Users },
      ],
    },
    {
      title: 'Infraestructura',
      items: [{ id: 'CU04', label: 'Zonas de Cobertura', icon: MapPin }],
    },
    {
      title: 'Abonados & Clientes',
      items: [
        { id: 'CU05', label: 'Registrar Nuevo Cliente', icon: UserPlus },
        { id: 'CU06', label: 'Consultar / Buscar Clientes', icon: Search },
        { id: 'CU07', label: 'Actualizar / Baja Cliente', icon: Edit3 },
      ],
    },
    {
      title: 'Servicios de Internet',
      items: [{ id: 'CU08', label: 'Registrar / Activar Servicio', icon: Wifi }],
    },
    {
      title: 'Mensualidades & Pagos',
      items: [
        { id: 'CU09', label: 'Generar Mensualidades', icon: Calendar },
        { id: 'CU10', label: 'Gestionar Pago de Mensualidad', icon: CreditCard },
        { id: 'CU11', label: 'Historial de Pagos', icon: Clock },
      ],
    },
    {
      title: 'Operaciones Técnicas',
      items: [
        { id: 'CU12', label: 'Alertas de Vencimiento', icon: AlertTriangle },
        { id: 'CU13', label: 'Servicios para Corte', icon: Scissors },
        { id: 'CU14', label: 'Registrar Corte Realizado', icon: Scissors },
        { id: 'CU15', label: 'Reactivaciones de Servicio', icon: RefreshCw },
      ],
    },
  ];

  // Solo se muestran los módulos para los que el usuario posee permiso real.
  // (Ocultar aquí no sustituye la autorización del backend.)
  const visibleMenuSections = menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccessCu(currentUser, item.id)),
    }))
    .filter((section) => section.items.length > 0);

  const handleIrACorte = (servicio) => {
    setCorteServicioSelected(servicio);
    setActiveCU('CU14');
  };

  const renderActiveView = () => {
    // Se renderiza el módulo EFECTIVO (siempre permitido). Si alguien fuerza
    // `activeCU` a un módulo sin permiso desde el navegador, no se muestra:
    // se deriva a otro permitido. El backend autoriza de verdad.
    switch (effectiveCu) {
      case 'CU01':
        return <SesionView user={currentUser} onLogout={handleLogout} />;
      case 'CU02':
        return <AuditoriaView />;
      case 'CU03':
        return <UsuariosView user={currentUser} />;
      case 'CU04':
        return <ZonasCoberturaView user={currentUser} />;
      case 'CU05':
        return <ClienteRegistroView onClienteCreated={() => setActiveCU('CU06')} />;
      case 'CU06':
        return <ClienteConsultaView />;
      case 'CU07':
        return <ClienteMantenimientoView />;
      case 'CU08':
        return <ServicioInternetView user={currentUser} />;
      case 'CU09':
        return <MensualidadGeneracionView user={currentUser} />;
      case 'CU10':
        return <PagoMensualidadView />;
      case 'CU11':
        return <HistorialPagosView />;
      case 'CU12':
        return <AlertasVencimientoView />;
      case 'CU13':
        return <ServiciosCorteView onIrACorte={handleIrACorte} />;
      case 'CU14':
        return <CorteRegistroView initialServicio={corteServicioSelected} />;
      case 'CU15':
        return <ReactivacionesView user={currentUser} />;
      default:
        return <ClienteConsultaView />;
    }
  };

  // --- Estado de arranque ---
  if (booting) {
    return (
      <div className="boot-screen">
        <RefreshCw size={26} className="spin" />
        <span>Cargando TELCOM…</span>
      </div>
    );
  }

  // --- Página pública ---
  if (view === 'landing') {
    return <LandingView onEnterPortal={() => setView('login')} />;
  }

  // --- Protección de rutas: sin sesión no se entra al panel ---
  if (view === 'login' || !isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onBack={() => setView('landing')}
      />
    );
  }

  // --- Panel administrativo (módulos existentes) ---
  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <Radio size={24} />
          </div>
          <div>
            <div className="brand-title">TELCOM ISP</div>
            <div className="brand-subtitle">Panel de Gestión</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {visibleMenuSections.map((section, idx) => (
            <div key={idx} className="nav-group">
              <div className="nav-group-title">{section.title}</div>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = effectiveCu === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCU(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <IconComponent size={16} />
                    <span className="nav-item-label">{item.label}</span>
                    <span className="nav-cu-tag">{item.id}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini">
            <div className="user-avatar">
              {(currentUser?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="user-mini-info">
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{currentUser?.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{currentUser?.email}</div>
            </div>
          </div>
          <button
            title="Cerrar Sesión"
            className="btn btn-sm btn-secondary"
            onClick={handleLogout}
          >
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <span className="badge badge-primary">Estructura MVC</span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Caso de Uso Activo: <strong style={{ color: '#fff' }}>{effectiveCu}</strong>
            </span>
          </div>

          <div className="top-bar-right">
            <span className="badge badge-info">
              <Server size={13} style={{ marginRight: 4 }} /> Laravel API
            </span>
            <span className="badge badge-success">
              <Database size={13} style={{ marginRight: 4 }} /> PostgreSQL
            </span>
          </div>
        </header>

        <div className="content-body">{renderActiveView()}</div>
      </main>
    </div>
  );
}
