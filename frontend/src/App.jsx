import React, { useState } from 'react';

// Importación de las 15 Vistas de Casos de Uso
import LoginView from './views/CU01_IniciarCerrarSesion/LoginView';
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

// Iconos para cada Caso de Uso
import {
  Radio, LogIn, LogOut, History, Users, MapPin,
  UserPlus, Search, Edit3, Wifi, Calendar,
  CreditCard, Clock, AlertTriangle, Scissors, RefreshCw,
  Server, Database
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Admin Senior TELCOM',
    email: 'admin@telcom.com',
    role: 'Administrador de Sistema'
  });

  const [activeCU, setActiveCU] = useState('CU06');
  const [corteServicioSelected, setCorteServicioSelected] = useState(null);

  const menuSections = [
    {
      title: 'Seguridad & Auditoría',
      items: [
        { id: 'CU01', label: 'Iniciar / Cerrar Sesión', icon: LogIn },
        { id: 'CU02', label: 'Bitácora de Auditoría', icon: History },
        { id: 'CU03', label: 'Usuarios, Roles y Permisos', icon: Users },
      ]
    },
    {
      title: 'Infraestructura',
      items: [
        { id: 'CU04', label: 'Zonas de Cobertura', icon: MapPin },
      ]
    },
    {
      title: 'Abonados & Clientes',
      items: [
        { id: 'CU05', label: 'Registrar Nuevo Cliente', icon: UserPlus },
        { id: 'CU06', label: 'Consultar y Buscar Clientes', icon: Search },
        { id: 'CU07', label: 'Actualizar y Baja Lógica', icon: Edit3 },
      ]
    },
    {
      title: 'Servicios de Internet',
      items: [
        { id: 'CU08', label: 'Registrar y Activar Servicio', icon: Wifi },
      ]
    },
    {
      title: 'Facturación & Cobranzas',
      items: [
        { id: 'CU09', label: 'Generar Mensualidades', icon: Calendar },
        { id: 'CU10', label: 'Gestionar Pago Mensualidad', icon: CreditCard },
        { id: 'CU11', label: 'Consultar Historial Pagos', icon: Clock },
      ]
    },
    {
      title: 'Operaciones Técnicas',
      items: [
        { id: 'CU12', label: 'Alertas de Vencimiento', icon: AlertTriangle },
        { id: 'CU13', label: 'Listado Servicios para Corte', icon: Scissors },
        { id: 'CU14', label: 'Registrar Corte Realizado', icon: Scissors },
        { id: 'CU15', label: 'Lista y Registro Reactivaciones', icon: RefreshCw },
      ]
    }
  ];

  const handleIrACorte = (servicio) => {
    setCorteServicioSelected(servicio);
    setActiveCU('CU14');
  };

  const renderActiveView = () => {
    switch (activeCU) {
      case 'CU01':
        return <LoginView onLoginSuccess={(user) => { setCurrentUser(user); setActiveCU('CU06'); }} />;
      case 'CU02':
        return <AuditoriaView />;
      case 'CU03':
        return <UsuariosView />;
      case 'CU04':
        return <ZonasCoberturaView />;
      case 'CU05':
        return <ClienteRegistroView onClienteCreated={() => setActiveCU('CU06')} />;
      case 'CU06':
        return <ClienteConsultaView />;
      case 'CU07':
        return <ClienteMantenimientoView />;
      case 'CU08':
        return <ServicioInternetView />;
      case 'CU09':
        return <MensualidadGeneracionView />;
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
        return <ReactivacionesView />;
      default:
        return <ClienteConsultaView />;
    }
  };

  // Si está en CU01 (Login) en pantalla completa
  if (activeCU === 'CU01' && !currentUser) {
    return <LoginView onLoginSuccess={(u) => { setCurrentUser(u); setActiveCU('CU06'); }} />;
  }

  return (
    <div className="app-container">
      {/* Barra Lateral Navegación MVC - Casos de Uso */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <Radio size={24} />
          </div>
          <div>
            <div className="brand-title">TELCOM ISP</div>
            <div className="brand-subtitle">Arquitectura Senior MVC</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuSections.map((section, idx) => (
            <div key={idx} className="nav-group">
              <div className="nav-group-title">{section.title}</div>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeCU === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveCU(item.id)}
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
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{currentUser?.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{currentUser?.role || 'Admin'}</div>
            </div>
          </div>
          <button
            title="Cerrar Sesión"
            className="btn btn-sm btn-secondary"
            onClick={() => setActiveCU('CU01')}
          >
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <span className="badge badge-primary">Estructura MVC</span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Caso de Uso Activo: <strong style={{ color: '#fff' }}>{activeCU}</strong>
            </span>
          </div>

          <div className="top-bar-right">
            <span className="badge badge-info">
              <Server size={13} style={{ marginRight: 4 }} /> Laravel 11 API
            </span>
            <span className="badge badge-success">
              <Database size={13} style={{ marginRight: 4 }} /> PostgreSQL
            </span>
          </div>
        </header>

        <div className="content-body">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}
