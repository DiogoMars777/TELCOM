# 📡 SISTEMA DE TELECOMUNICACIONES (TELCOM)

### 🏗️ Arquitectura Senior MVC orientada a Casos de Uso (CU01 - CU15)
- **Backend:** Laravel 11/13 + PostgreSQL
- **Frontend:** React + Vite
- **Base de Datos:** PostgreSQL 16+

---

## 📂 Estructura de Directorios del Proyecto

```text
TELCOM_PROYECTO/
│
├── backend/                                   # Backend Laravel (API & MVC)
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/                   # Controladores agrupados por CU
│   │   │       ├── CU01_IniciarCerrarSesion/
│   │   │       ├── CU02_BitacoraAuditoria/
│   │   │       ├── CU03_UsuariosRolesPermisos/
│   │   │       ├── CU04_ZonasCobertura/
│   │   │       ├── CU05_RegistrarCliente/
│   │   │       ├── CU06_ConsultarBuscarClientes/
│   │   │       ├── CU07_ActualizarBajaCliente/
│   │   │       ├── CU08_RegistrarActivarServicio/
│   │   │       ├── CU09_GenerarMensualidades/
│   │   │       ├── CU10_GestionarPagoMensualidad/
│   │   │       ├── CU11_ConsultarHistorialPagos/
│   │   │       ├── CU12_VisualizarAlertasVencimiento/
│   │   │       ├── CU13_ListadoServiciosCorte/
│   │   │       ├── CU14_RegistrarCorteRealizado/
│   │   │       └── CU15_ListaRegistroReactivaciones/
│   │   └── Models/                            # Modelos Eloquent agrupados por CU
│   │       ├── CU01_IniciarCerrarSesion/
│   │       ├── CU02_BitacoraAuditoria/
│   │       ├── CU03_UsuariosRolesPermisos/
│   │       ├── CU04_ZonasCobertura/
│   │       ├── CU05_RegistrarCliente/
│   │       ├── CU06_ConsultarBuscarClientes/
│   │       ├── CU07_ActualizarBajaCliente/
│   │       ├── CU08_RegistrarActivarServicio/
│   │       ├── CU09_GenerarMensualidades/
│   │       ├── CU10_GestionarPagoMensualidad/
│   │       ├── CU11_ConsultarHistorialPagos/
│   │       ├── CU12_VisualizarAlertasVencimiento/
│   │       ├── CU13_ListadoServiciosCorte/
│   │       ├── CU14_RegistrarCorteRealizado/
│   │       └── CU15_ListaRegistroReactivaciones/
│   ├── resources/
│   │   └── views/                             # Vistas Blade agrupadas por CU
│   │       ├── CU01_IniciarCerrarSesion/
│   │       ├── CU02_BitacoraAuditoria/
│   │       ├── CU03_UsuariosRolesPermisos/
│   │       ├── ... (CU04 al CU15)
│   ├── database/
│   │   ├── migrations/                        # Migraciones para PostgreSQL
│   │   └── seeders/                           # Datos iniciales (Usuarios, Roles, Zonas, Servicios)
│   └── routes/
│       ├── api.php                            # Endpoints REST para los 15 Casos de Uso
│       └── web.php
│
└── frontend/                                  # Frontend React (Vite)
    └── src/
        ├── controllers/                       # Hooks controladores por CU
        │   ├── CU01_IniciarCerrarSesion/
        │   ├── CU02_BitacoraAuditoria/
        │   ├── CU03_UsuariosRolesPermisos/
        │   ├── ... (CU04 al CU15)
        ├── models/                            # Modelos de datos y servicios API por CU
        │   ├── CU01_IniciarCerrarSesion/
        │   ├── CU02_BitacoraAuditoria/
        │   ├── CU03_UsuariosRolesPermisos/
        │   ├── ... (CU04 al CU15)
        ├── views/                             # Componentes visuales UI por CU
        │   ├── CU01_IniciarCerrarSesion/
        │   ├── CU02_BitacoraAuditoria/
        │   ├── CU03_UsuariosRolesPermisos/
        │   ├── ... (CU04 al CU15)
        ├── services/                          # Cliente HTTP base (apiClient.js)
        ├── App.jsx                            # Dashboard y navegador interactivo
        └── index.css                          # Sistema de diseño moderno
```

---

## 🎯 Relación de Casos de Uso (15 CUs)

| CU | Descripción del Caso de Uso | Controlador Backend | Modelo Backend | Vista React |
| :--- | :--- | :--- | :--- | :--- |
| **CU01** | Iniciar y cerrar sesión | `AuthController` | `UserSession` | `LoginView` |
| **CU02** | Consultar bitácora de auditoría | `AuditoriaController` | `BitacoraAuditoria` | `AuditoriaView` |
| **CU03** | Gestionar usuarios internos, roles y permisos | `UsuarioController` | `Rol`, `Permiso` | `UsuariosView` |
| **CU04** | Gestionar zonas de cobertura | `ZonaCoberturaController` | `ZonaCobertura` | `ZonasCoberturaView` |
| **CU05** | Registrar nuevo cliente | `ClienteRegistroController` | `Cliente` | `ClienteRegistroView` |
| **CU06** | Consultar y buscar clientes | `ClienteConsultaController` | `ClienteConsulta` | `ClienteConsultaView` |
| **CU07** | Actualizar datos y dar baja lógica a cliente | `ClienteMantenimientoController` | `ClienteBajaLogica` | `ClienteMantenimientoView` |
| **CU08** | Registrar y activar servicio de Internet | `ServicioInternetController` | `ServicioInternet` | `ServicioInternetView` |
| **CU09** | Generar mensualidades de servicios | `MensualidadGeneracionController`| `MensualidadFacturacion`| `MensualidadGeneracionView` |
| **CU10** | Gestionar pago de mensualidad | `PagoMensualidadController` | `PagoMensualidad` | `PagoMensualidadView` |
| **CU11** | Consultar historial de pagos | `HistorialPagosController` | `HistorialPago` | `HistorialPagosView` |
| **CU12** | Visualizar alertas de vencimiento | `AlertasVencimientoController` | `AlertaVencimiento` | `AlertasVencimientoView` |
| **CU13** | Consultar listado de servicios para corte | `ServiciosCorteController` | `ServicioParaCorte` | `ServiciosCorteView` |
| **CU14** | Registrar corte realizado | `CorteRegistroController` | `RegistroCorte` | `CorteRegistroView` |
| **CU15** | Gestionar lista y registro de reactivaciones | `ReactivacionesController` | `ReactivacionServicio` | `ReactivacionesView` |

---

## ⚙️ Instrucciones de Ejecución

### 1. Configuración de PostgreSQL (Backend)
En el archivo `backend/.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=telcom_db
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
```

Ejecutar migraciones y datos iniciales:
```bash
cd backend
php artisan migrate --seed
php artisan serve
```
El servidor backend se ejecutará en: `http://localhost:8000`

### 2. Ejecución de Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
La aplicación React se ejecutará en: `http://localhost:5173`
