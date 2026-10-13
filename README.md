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
│   │   │   └── Controllers/
│   │   │       └── Paquetes/                  # Controladores por paquete funcional
│   │   │           ├── SeguridadAdministracion/       # CU01-CU03
│   │   │           │   ├── CU01_IniciarCerrarSesion/
│   │   │           │   ├── CU02_BitacoraAuditoria/
│   │   │           │   └── CU03_UsuariosRolesPermisos/
│   │   │           ├── GestionClientesZonas/          # CU04-CU07
│   │   │           │   ├── CU04_ZonasCobertura/
│   │   │           │   ├── CU05_RegistrarCliente/
│   │   │           │   ├── CU06_ConsultarBuscarClientes/
│   │   │           │   └── CU07_ActualizarBajaCliente/
│   │   │           ├── ServiciosPlanes/               # CU08, CU13-CU15 y Planes
│   │   │           │   ├── CU08_RegistrarActivarServicio/
│   │   │           │   ├── CU13_ListadoServiciosCorte/
│   │   │           │   ├── CU14_RegistrarCorteRealizado/
│   │   │           │   ├── CU15_ListaRegistroReactivaciones/
│   │   │           │   └── Planes/
│   │   │           └── FacturacionCobranza/           # CU09-CU12
│   │   │               ├── CU09_GenerarMensualidades/
│   │   │               ├── CU10_GestionarPagoMensualidad/
│   │   │               ├── CU11_ConsultarHistorialPagos/
│   │   │               └── CU12_VisualizarAlertasVencimiento/
│   │   └── Models/
│   │       └── Paquetes/                      # Modelos Eloquent por paquete funcional
│   │           ├── SeguridadAdministracion/   # CU01-CU03
│   │           ├── GestionClientesZonas/      # CU04-CU07
│   │           ├── ServiciosPlanes/           # CU08, CU13-CU15 y Planes
│   │           └── FacturacionCobranza/       # CU09-CU12
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
        ├── controllers/                       # Hooks controladores
        │   └── Paquetes/                      # Agrupados por paquete funcional
        │       └── <Paquete>/CUxx_.../
        ├── models/                            # Modelos de datos y servicios API
        │   └── Paquetes/
        │       └── <Paquete>/CUxx_.../
        ├── views/                             # Componentes visuales UI
        │   ├── Paquetes/
        │   │   └── <Paquete>/CUxx_.../
        │   └── Public/                        # Landing y páginas públicas
        ├── services/                          # Cliente HTTP base (apiClient.js)
        ├── config/                            # Permisos (access.js), planes, sitio
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

### 3. Usuarios de demostración (SOLO entorno local)

Para comparar visualmente el menú y los permisos de cada rol (Administrador,
Secretaría y Técnico) existe un seeder **separado y condicionado al entorno**:

- **No** se ejecuta en producción (`APP_ENV=production`).
- **No** forma parte de `DatabaseSeeder`, por lo que nunca corre de forma
  automática con `php artisan migrate --seed`.
- **No** sobrescribe la contraseña de un usuario existente.

Crear (o reapuntar) las cuentas:

```bash
cd backend
php artisan db:seed --class=DemoUsersSeeder
```

| Rol | Correo |
| --- | --- |
| Administrador | `admin.demo@telcom.local` |
| Secretaría | `secretaria.demo@telcom.local` |
| Técnico | `tecnico.demo@telcom.local` |

La contraseña se toma de la variable de entorno `TELCOM_DEMO_PASSWORD`. Si no
se define, se usa el valor de desarrollo `Demo123456!`. Para usar una
contraseña propia sin dejarla en el repositorio, defínela en `backend/.env`:

```env
TELCOM_DEMO_PASSWORD=MiClaveLocalSegura
```

Restablecer la contraseña de cuentas demo ya existentes (no toca a otros
usuarios):

```bash
# Con TELCOM_DEMO_RESET_PASSWORD=true definido en backend/.env
php artisan db:seed --class=DemoUsersSeeder
```

> ⚠️ Estas cuentas son **solo para desarrollo local**. No deben usarse como
> cuentas de operación reales ni publicarse. El menú de la interfaz se filtra
> con los permisos que el backend devuelve en `GET /api/cu01/me`; el backend
> sigue siendo el que autoriza cada operación (HTTP 401/403).

### 4. Planes de Internet y estados de servicio

Se incorporan tres entidades del modelo StarUML, de forma **incremental y no
destructiva** (no se eliminan columnas antiguas de `servicios_internet`):

| Entidad UML | Tabla | Modelo |
| --- | --- | --- |
| `EstadoServicio` | `estados_servicio` | `App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\EstadoServicio` |
| `PlanInternet` | `planes_internet` | `App\Models\Paquetes\ServiciosPlanes\Planes\PlanInternet` |
| `AsignacionPlan` | `asignaciones_plan` | `App\Models\Paquetes\ServiciosPlanes\Planes\AsignacionPlan` |

Relaciones implementadas (según el UML):
- `EstadoServicio [1] → ServicioInternet [0..*]` (columna nueva `estado_servicio_id`).
- `ServicioInternet [1] → AsignacionPlan [1..*]` (historial; nunca se sobrescribe).
- `PlanInternet [1] → AsignacionPlan [0..*]`.
- `Usuario [1] → AsignacionPlan [0..*]` (asociación `registra`).

Migración de datos:
- Los estados base (`PENDIENTE_INSTALACION`, `ACTIVO`, `SUSPENDIDO`, `CORTADO`)
  se crean a partir de los valores que ya usa el código.
- Cada combinación `(plan_nombre, velocidad_mbps)` existente genera un
  `PlanInternet`; el precio exacto de cada servicio se conserva en
  `AsignacionPlan.precio_aplicado`, por lo que **no se pierde ningún precio
  histórico**.
- Los servicios históricos **no registran quién asignó el plan**, por lo que
  `asignaciones_plan.user_id` queda `NULL` (no se inventa el dato). **Toda
  asignación nueva** sí exige usuario (se toma del usuario autenticado). Cuando
  se decida completar el historial, puede hacerse un backfill manual y luego
  endurecer la columna a `NOT NULL`.

Endpoints (reutilizan los permisos RBAC ya existentes `planes.view` /
`planes.assign`; el Técnico no los tiene → HTTP 403):

| Método | Ruta | Permiso |
| --- | --- | --- |
| `GET` | `/api/planes` | `planes.view` |
| `GET` | `/api/planes/{id}` | `planes.view` |
| `GET` | `/api/cu08/servicios/{id}/planes` | `planes.view` |
| `POST` | `/api/cu08/servicios/{id}/planes` | `planes.assign` |

El `POST` valida el plan en el backend (debe existir y estar **activo**),
cierra la asignación vigente (`fecha_fin`) sin borrarla y registra la nueva con
el usuario autenticado.


