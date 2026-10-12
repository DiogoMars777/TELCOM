<?php

use Illuminate\Support\Facades\Route;

// CU01: Iniciar y cerrar sesión
use App\Http\Controllers\CU01_IniciarCerrarSesion\AuthController;
// CU02: Consultar bitácora de auditoría
use App\Http\Controllers\CU02_BitacoraAuditoria\AuditoriaController;
// CU03: Gestionar usuarios internos, roles y permisos
use App\Http\Controllers\CU03_UsuariosRolesPermisos\UsuarioController;
// CU04: Gestionar zonas de cobertura
use App\Http\Controllers\CU04_ZonasCobertura\ZonaCoberturaController;
// CU05: Registrar nuevo cliente
use App\Http\Controllers\CU05_RegistrarCliente\ClienteRegistroController;
// CU06: Consultar y buscar clientes
use App\Http\Controllers\CU06_ConsultarBuscarClientes\ClienteConsultaController;
// CU07: Actualizar datos y dar baja lógica a cliente
use App\Http\Controllers\CU07_ActualizarBajaCliente\ClienteMantenimientoController;
// CU08: Registrar y activar servicio de Internet
use App\Http\Controllers\CU08_RegistrarActivarServicio\ServicioInternetController;
// CU09: Generar mensualidades de servicios
use App\Http\Controllers\CU09_GenerarMensualidades\MensualidadGeneracionController;
// CU10: Gestionar pago de mensualidad
use App\Http\Controllers\CU10_GestionarPagoMensualidad\PagoMensualidadController;
// CU11: Consultar historial de pagos
use App\Http\Controllers\CU11_ConsultarHistorialPagos\HistorialPagosController;
// CU12: Visualizar alertas de vencimiento
use App\Http\Controllers\CU12_VisualizarAlertasVencimiento\AlertasVencimientoController;
// CU13: Consultar listado de servicios para corte
use App\Http\Controllers\CU13_ListadoServiciosCorte\ServiciosCorteController;
// CU14: Registrar corte realizado
use App\Http\Controllers\CU14_RegistrarCorteRealizado\CorteRegistroController;
// CU15: Gestionar lista y registro de reactivaciones
use App\Http\Controllers\CU15_ListaRegistroReactivaciones\ReactivacionesController;

/*
|--------------------------------------------------------------------------
| RUTAS API - TELCOM SISTEMA DE TELECOMUNICACIONES
| Estructura MVC orientada a Casos de Uso (CU01 - CU15)
|--------------------------------------------------------------------------
*/

// CU01: Iniciar y cerrar sesión
Route::prefix('cu01')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// CU02: Consultar bitácora de auditoría
Route::prefix('cu02')->group(function () {
    Route::get('/auditoria', [AuditoriaController::class, 'index']);
});

// CU03: Gestionar usuarios internos, roles y permisos
Route::prefix('cu03')->group(function () {
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::put('/usuarios/{id}/roles', [UsuarioController::class, 'updateRoles']);
});

// CU04: Gestionar zonas de cobertura
Route::prefix('cu04')->group(function () {
    Route::get('/zonas', [ZonaCoberturaController::class, 'index']);
    Route::post('/zonas', [ZonaCoberturaController::class, 'store']);
    Route::put('/zonas/{id}', [ZonaCoberturaController::class, 'update']);
});

// CU05: Registrar nuevo cliente
Route::prefix('cu05')->group(function () {
    Route::post('/clientes', [ClienteRegistroController::class, 'store']);
});

// CU06: Consultar y buscar clientes
Route::prefix('cu06')->group(function () {
    Route::get('/clientes', [ClienteConsultaController::class, 'index']);
    Route::get('/clientes/{id}', [ClienteConsultaController::class, 'show']);
});

// CU07: Actualizar datos y dar baja lógica a cliente
Route::prefix('cu07')->group(function () {
    Route::put('/clientes/{id}', [ClienteMantenimientoController::class, 'update']);
    Route::delete('/clientes/{id}/baja', [ClienteMantenimientoController::class, 'bajaLogica']);
});

// CU08: Registrar y activar servicio de Internet
Route::prefix('cu08')->group(function () {
    Route::get('/servicios', [ServicioInternetController::class, 'index']);
    Route::post('/servicios', [ServicioInternetController::class, 'store']);
    Route::put('/servicios/{id}/activar', [ServicioInternetController::class, 'activar']);
});

// CU09: Generar mensualidades de servicios
Route::prefix('cu09')->group(function () {
    Route::get('/mensualidades', [MensualidadGeneracionController::class, 'index']);
    Route::post('/mensualidades/generar', [MensualidadGeneracionController::class, 'generar']);
});

// CU10: Gestionar pago de mensualidad
Route::prefix('cu10')->group(function () {
    Route::post('/pagos', [PagoMensualidadController::class, 'store']);
});

// CU11: Consultar historial de pagos
Route::prefix('cu11')->group(function () {
    Route::get('/historial', [HistorialPagosController::class, 'index']);
});

// CU12: Visualizar alertas de vencimiento
Route::prefix('cu12')->group(function () {
    Route::get('/alertas', [AlertasVencimientoController::class, 'index']);
});

// CU13: Consultar listado de servicios para corte
Route::prefix('cu13')->group(function () {
    Route::get('/servicios-corte', [ServiciosCorteController::class, 'index']);
});

// CU14: Registrar corte realizado
Route::prefix('cu14')->group(function () {
    Route::post('/cortes', [CorteRegistroController::class, 'store']);
});

// CU15: Gestionar lista y registro de reactivaciones
Route::prefix('cu15')->group(function () {
    Route::get('/reactivaciones', [ReactivacionesController::class, 'index']);
    Route::post('/reactivaciones', [ReactivacionesController::class, 'store']);
});
