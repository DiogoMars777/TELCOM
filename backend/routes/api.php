<?php

use Illuminate\Support\Facades\Route;

// CU01: Iniciar y cerrar sesión
use App\Http\Controllers\Paquetes\SeguridadAdministracion\CU01_IniciarCerrarSesion\AuthController;
// CU02: Consultar bitácora de auditoría
use App\Http\Controllers\Paquetes\SeguridadAdministracion\CU02_BitacoraAuditoria\AuditoriaController;
// CU03: Gestionar usuarios internos, roles y permisos
use App\Http\Controllers\Paquetes\SeguridadAdministracion\CU03_UsuariosRolesPermisos\UsuarioController;
use App\Http\Controllers\Paquetes\SeguridadAdministracion\CU03_UsuariosRolesPermisos\RolController;
// CU04: Gestionar zonas de cobertura
use App\Http\Controllers\Paquetes\GestionClientesZonas\CU04_ZonasCobertura\ZonaCoberturaController;
// CU05: Registrar nuevo cliente
use App\Http\Controllers\Paquetes\GestionClientesZonas\CU05_RegistrarCliente\ClienteRegistroController;
// CU06: Consultar y buscar clientes
use App\Http\Controllers\Paquetes\GestionClientesZonas\CU06_ConsultarBuscarClientes\ClienteConsultaController;
// CU07: Actualizar datos y dar baja lógica a cliente
use App\Http\Controllers\Paquetes\GestionClientesZonas\CU07_ActualizarBajaCliente\ClienteMantenimientoController;
// CU08: Registrar y activar servicio de Internet
use App\Http\Controllers\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\ServicioInternetController;
// CU09: Generar mensualidades de servicios
use App\Http\Controllers\Paquetes\FacturacionCobranza\CU09_GenerarMensualidades\MensualidadGeneracionController;
// CU10: Gestionar pago de mensualidad
use App\Http\Controllers\Paquetes\FacturacionCobranza\CU10_GestionarPagoMensualidad\PagoMensualidadController;
// CU11: Consultar historial de pagos
use App\Http\Controllers\Paquetes\FacturacionCobranza\CU11_ConsultarHistorialPagos\HistorialPagosController;
// CU12: Visualizar alertas de vencimiento
use App\Http\Controllers\Paquetes\FacturacionCobranza\CU12_VisualizarAlertasVencimiento\AlertasVencimientoController;
// CU13: Consultar listado de servicios para corte
use App\Http\Controllers\Paquetes\ServiciosPlanes\CU13_ListadoServiciosCorte\ServiciosCorteController;
// CU14: Registrar corte realizado
use App\Http\Controllers\Paquetes\ServiciosPlanes\CU14_RegistrarCorteRealizado\CorteRegistroController;
// CU15: Gestionar lista y registro de reactivaciones
use App\Http\Controllers\Paquetes\ServiciosPlanes\CU15_ListaRegistroReactivaciones\ReactivacionesController;
// Planes: catálogo de planes y asignación a servicios (entidades UML)
use App\Http\Controllers\Paquetes\ServiciosPlanes\Planes\PlanInternetController;
use App\Http\Controllers\Paquetes\ServiciosPlanes\Planes\AsignacionPlanController;

/*
|--------------------------------------------------------------------------
| RUTAS API - TELCOM SISTEMA DE TELECOMUNICACIONES
| Estructura MVC orientada a Casos de Uso (CU01 - CU15)
|--------------------------------------------------------------------------
| - CU01 /login es la ÚNICA ruta pública (permite obtener el token).
| - CU01 /logout y /me, y TODAS las rutas CU02-CU15 exigen auth:sanctum.
| - Cada operación privada exige ADEMÁS el permiso RBAC correspondiente
|   (middleware `permission:<slug>`), resuelto contra `roles`, `permisos`
|   y `rol_permiso`. Sin permiso -> HTTP 403.
|--------------------------------------------------------------------------
*/

// CU01: Iniciar y cerrar sesión
Route::prefix('cu01')->group(function () {
    // Pública: necesaria para obtener el token Bearer
    Route::post('/login', [AuthController::class, 'login'])->middleware('login.throttle');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

    // Recuperación de contraseña
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Cambiar la contraseña del usuario AUTENTICADO. Todos los roles internos
    // (Administrador, Secretaría y Soporte Técnico) poseen `auth.login`, por lo
    // que pueden usar esta operación; el controlador actúa SIEMPRE sobre el
    // usuario de la sesión e ignora cualquier id del cuerpo.
    Route::post('/cambiar-password', [AuthController::class, 'changePassword'])
        ->middleware(['auth:sanctum', 'permission:auth.login']);
});

// CU02: Consultar bitácora de auditoría (solo administrador)
Route::prefix('cu02')->middleware(['auth:sanctum', 'permission:auditoria.view'])->group(function () {
    Route::get('/auditoria', [AuditoriaController::class, 'index']);
    Route::get('/auditoria/usuarios', [AuditoriaController::class, 'usuarios']);
});

// CU03: Gestionar usuarios internos, roles y permisos (solo administrador)
// CU03: Gestionar usuarios internos, roles y permisos (solo administrador)
Route::prefix('cu03')->middleware(['auth:sanctum', 'permission:usuarios.manage'])->group(function () {
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::put('/usuarios/{id}/rol', [UsuarioController::class, 'updateRoles']);
    Route::put('/usuarios/{id}', [UsuarioController::class, 'update'])->whereNumber('id');

    // Matriz editable de roles -> permisos.
    Route::get('/roles', [RolController::class, 'index']);
    Route::put('/roles/{id}/permisos', [RolController::class, 'updatePermisos'])->whereNumber('id');
});

// CU04: Gestionar zonas de cobertura (solo administrador)
Route::prefix('cu04')->middleware(['auth:sanctum', 'permission:zonas.manage'])->group(function () {
    Route::get('/zonas', [ZonaCoberturaController::class, 'index']);
    Route::post('/zonas', [ZonaCoberturaController::class, 'store']);
    Route::put('/zonas/{id}', [ZonaCoberturaController::class, 'update']);
});

// CU05: Registrar nuevo cliente (administrador, secretaría)
Route::prefix('cu05')->middleware(['auth:sanctum', 'permission:clientes.create'])->group(function () {
    // Catálogo de zonas para el formulario de registro (mismo permiso que la
    // operación: quien puede registrar un cliente debe poder elegir su zona).
    Route::get('/zonas', [ZonaCoberturaController::class, 'index']);
    Route::post('/clientes', [ClienteRegistroController::class, 'store']);
});

// CU06: Consultar y buscar clientes (admin, secretaría, técnico)
Route::prefix('cu06')->middleware(['auth:sanctum', 'permission:clientes.view'])->group(function () {
    Route::get('/clientes', [ClienteConsultaController::class, 'index']);
    Route::get('/clientes/{id}', [ClienteConsultaController::class, 'show']);
});

// CU07: Actualizar datos y dar baja lógica a cliente (admin, secretaría)
Route::prefix('cu07')->middleware(['auth:sanctum', 'permission:clientes.update'])->group(function () {
    Route::put('/clientes/{id}', [ClienteMantenimientoController::class, 'update']);
    Route::delete('/clientes/{id}/baja', [ClienteMantenimientoController::class, 'bajaLogica']);
});

// CU08: Registrar y activar servicio de Internet
Route::prefix('cu08')->group(function () {
    // Consulta: admin, secretaría, técnico
    Route::get('/servicios', [ServicioInternetController::class, 'index'])
        ->middleware(['auth:sanctum', 'permission:servicios.view']);
    // Registro / activación administrativa: admin, secretaría
    Route::post('/servicios', [ServicioInternetController::class, 'store'])
        ->middleware(['auth:sanctum', 'permission:servicios.manage']);
    Route::put('/servicios/{id}/activar', [ServicioInternetController::class, 'activar'])
        ->middleware(['auth:sanctum', 'permission:servicios.manage']);
});

// CU09: Generar mensualidades de servicios (admin, secretaría)
Route::prefix('cu09')->group(function () {
    Route::get('/mensualidades', [MensualidadGeneracionController::class, 'index'])
        ->middleware(['auth:sanctum', 'permission:mensualidades.view']);
    Route::post('/mensualidades/generar', [MensualidadGeneracionController::class, 'generar'])
        ->middleware(['auth:sanctum', 'permission:mensualidades.generate']);
});

// CU10: Gestionar pago de mensualidad (admin, secretaría)
Route::prefix('cu10')->middleware(['auth:sanctum', 'permission:pagos.register'])->group(function () {
    Route::post('/pagos', [PagoMensualidadController::class, 'store']);
});

// CU11: Consultar historial de pagos (admin, secretaría)
Route::prefix('cu11')->middleware(['auth:sanctum', 'permission:pagos.history'])->group(function () {
    Route::get('/historial', [HistorialPagosController::class, 'index']);
});

// CU12: Visualizar alertas de vencimiento (admin, secretaría)
Route::prefix('cu12')->middleware(['auth:sanctum', 'permission:alertas.view'])->group(function () {
    Route::get('/alertas', [AlertasVencimientoController::class, 'index']);
});

// CU13: Consultar listado de servicios para corte (admin, secretaría)
Route::prefix('cu13')->middleware(['auth:sanctum', 'permission:cortes.list'])->group(function () {
    Route::get('/servicios-corte', [ServiciosCorteController::class, 'index']);
});

// CU14: Registrar corte realizado (admin, secretaría)
Route::prefix('cu14')->middleware(['auth:sanctum', 'permission:cortes.register'])->group(function () {
    Route::post('/cortes', [CorteRegistroController::class, 'store']);
});

// CU15: Gestionar lista y registro de reactivaciones (admin, secretaría)
Route::prefix('cu15')->middleware(['auth:sanctum', 'permission:reactivaciones.manage'])->group(function () {
    Route::get('/reactivaciones', [ReactivacionesController::class, 'index']);
    Route::post('/reactivaciones', [ReactivacionesController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| PLANES DE INTERNET (entidades UML: PlanInternet y AsignacionPlan)
|--------------------------------------------------------------------------
| Se reutilizan los permisos REALES ya existentes en la matriz RBAC:
|   - planes.view   -> admin, secretaría.
|   - planes.assign -> admin, secretaría.
| El técnico NO los tiene: el middleware `permission` devuelve HTTP 403.
*/

// Catálogo de planes
Route::prefix('planes')->group(function () {
    // Consultar / buscar (admin y secretaría).
    Route::get('/', [PlanInternetController::class, 'index'])
        ->middleware(['auth:sanctum', 'permission:planes.view']);
    Route::get('/{id}', [PlanInternetController::class, 'show'])
        ->whereNumber('id')
        ->middleware(['auth:sanctum', 'permission:planes.view']);

    // CU16 - Gestión del catálogo (SOLO administrador).
    Route::post('/', [PlanInternetController::class, 'store'])
        ->middleware(['auth:sanctum', 'permission:planes.manage']);
    Route::put('/{id}', [PlanInternetController::class, 'update'])
        ->whereNumber('id')
        ->middleware(['auth:sanctum', 'permission:planes.manage']);
    // Activar/desactivar: nunca se borra un plan con historial.
    Route::put('/{id}/activar', [PlanInternetController::class, 'activar'])
        ->whereNumber('id')
        ->middleware(['auth:sanctum', 'permission:planes.manage']);
    Route::put('/{id}/desactivar', [PlanInternetController::class, 'desactivar'])
        ->whereNumber('id')
        ->middleware(['auth:sanctum', 'permission:planes.manage']);
});

// Historial y asignación de plan de un servicio (nunca se sobrescribe)
Route::prefix('cu08/servicios/{servicio}/planes')->group(function () {
    Route::get('/', [AsignacionPlanController::class, 'index'])
        ->middleware(['auth:sanctum', 'permission:planes.view']);
    Route::post('/', [AsignacionPlanController::class, 'store'])
        ->middleware(['auth:sanctum', 'permission:planes.assign']);
});
