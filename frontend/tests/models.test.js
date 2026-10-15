/**
 * Pruebas reales de la capa de datos (frontend/src/models).
 *
 * Verifican que, con el modo demostración DESACTIVADO (por defecto), los
 * servicios NO sustituyan silenciosamente los errores por datos de ejemplo,
 * y que dicho modo sólo se active de forma explícita.
 *
 * Ejecutar:  npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

globalThis.localStorage = new MemoryStorage();
globalThis.Event = class Event { constructor(type) { this.type = type; } };
globalThis.window = { dispatchEvent: () => {} };

const { isDemoMode } = await import('../src/config/appConfig.js');
const { zonaService, mockZonas } = await import('../src/models/Paquetes/GestionClientesZonas/CU04_ZonasCobertura/zonaCoberturaModel.js');
const { clienteConsultaService } = await import('../src/models/Paquetes/GestionClientesZonas/CU06_ConsultarBuscarClientes/clienteConsultaModel.js');
const { mensualidadService } = await import('../src/models/Paquetes/FacturacionCobranza/CU09_GenerarMensualidades/mensualidadModel.js');
const { alertasService } = await import('../src/models/Paquetes/FacturacionCobranza/CU12_VisualizarAlertasVencimiento/alertaVencimientoModel.js');
const { pagoMensualidadService } = await import('../src/models/Paquetes/FacturacionCobranza/CU10_GestionarPagoMensualidad/pagoMensualidadModel.js');
const { planInternetService } = await import('../src/models/Paquetes/ServiciosPlanes/CU16_GestionarCatalogoPlanes/planInternetModel.js');
const { asignacionPlanService } = await import('../src/models/Paquetes/ServiciosPlanes/CU17_AsignarCambiarPlanInternet/asignacionPlanModel.js');

function jsonResponse(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

let fetchCalls = 0;
function stubFetch(response) {
  fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    if (response instanceof Error) throw response;
    return response;
  };
}

test.beforeEach(() => {
  globalThis.__TELCOM_DEMO__ = false;
});

test('El modo demostración está desactivado por defecto', () => {
  delete globalThis.__TELCOM_DEMO__;
  assert.equal(isDemoMode(), false);
});

test('GET fallido NO devuelve datos ficticios: el servicio rechaza', async () => {
  stubFetch(jsonResponse(500, { success: false, message: 'boom' }));
  await assert.rejects(zonaService.fetchZonas(), (err) => err.status === 500);
  assert.equal(fetchCalls, 1);
});

test('Fallo de red en un GET se propaga (no se sustituye por mockZonas)', async () => {
  stubFetch(new Error('offline'));
  await assert.rejects(zonaService.fetchZonas());
  assert.notEqual(await zonaServiceFetchOrNull(), mockZonas);
});

// Ayudante para comprobar que no se resuelve con el mock.
async function zonaServiceFetchOrNull() {
  try {
    return await zonaService.fetchZonas();
  } catch {
    return null;
  }
}

test('CU06 tampoco sustituye errores por su lista de ejemplo', async () => {
  stubFetch(jsonResponse(403, { success: false, message: 'Prohibido' }));
  await assert.rejects(clienteConsultaService.fetchClientes({}));
});

test('En modo demostración explícito se devuelven los datos de ejemplo sin llamar a la red', async () => {
  globalThis.__TELCOM_DEMO__ = true;
  // Si el servicio llamara a fetch, este stub lanzaría y la prueba fallaría.
  globalThis.fetch = async () => { throw new Error('No debería llamarse a fetch en modo demostración'); };
  const zonas = await zonaService.fetchZonas();
  assert.deepEqual(zonas, mockZonas);
});

test('CU12 exitoso extrae data.alertas realmente', async () => {
  stubFetch(jsonResponse(200, { success: true, data: { alertas: [{ mensualidad_id: 9 }] } }));
  const alertas = await alertasService.fetchAlertas();
  assert.equal(alertas.length, 1);
  assert.equal(alertas[0].mensualidad_id, 9);
});

test('CU09 aplana las relaciones cliente/servicio de la respuesta real', async () => {
  stubFetch(jsonResponse(200, {
    success: true,
    data: {
      data: [
        {
          id: 1,
          codigo_factura: 'FAC-1',
          monto: 100,
          cliente: { nombres: 'Ana', apellidos: 'Pérez' },
          servicio: { codigo_servicio: 'SRV-1' },
        },
      ],
    },
  }));
  const [factura] = await mensualidadService.fetchMensualidades('2026-10');
  assert.equal(factura.cliente_nombre, 'Ana Pérez');
  assert.equal(factura.servicio_codigo, 'SRV-1');
});

test('CU10 consultarPorCI envía GET a /cu10/portal-cliente/consultar/{ci}', async () => {
  let calledUrl = '';
  globalThis.fetch = async (url) => {
    calledUrl = String(url);
    return jsonResponse(200, {
      success: true,
      data: {
        tiene_deuda: true,
        cliente: { ci: '8492019' },
        factura: { id: 1, monto: 220 },
      },
    });
  };
  const res = await pagoMensualidadService.consultarPorCI('8492019');
  assert.ok(calledUrl.includes('/cu10/portal-cliente/consultar/8492019'));
  assert.equal(res.tiene_deuda, true);
});

test('CU10 pagarEnLinea envía POST a /cu10/portal-cliente/pagar con datos correctos', async () => {
  let calledUrl = '';
  let sentBody = null;
  globalThis.fetch = async (url, opts) => {
    calledUrl = String(url);
    sentBody = JSON.parse(opts.body);
    return jsonResponse(201, {
      success: true,
      data: {
        recibo: { codigo_recibo: 'REC-ONL-123' },
      },
    });
  };
  const res = await pagoMensualidadService.pagarEnLinea({
    mensualidad_id: 1,
    monto_pagado: 220,
    metodo_pago: 'QR',
  });
  assert.ok(calledUrl.includes('/cu10/portal-cliente/pagar'));
  assert.equal(sentBody.metodo_pago, 'QR');
  assert.equal(res.recibo.codigo_recibo, 'REC-ONL-123');
});

test('CU16 fetchPlanes lee el catálogo real de /planes', async () => {
  stubFetch(jsonResponse(200, {
    success: true,
    data: {
      planes: [
        { id: 1, nombre_plan: 'Plan A', velocidad_mbps: 50, precio_mensual: 120, activo: true },
      ],
    },
  }));
  const planes = await planInternetService.fetchPlanes();
  assert.equal(planes.length, 1);
  assert.equal(planes[0].nombre_plan, 'Plan A');
  assert.equal(planes[0].activo, true);
});

test('CU16 crear/editar/desactivar usan los verbos y rutas correctas', async () => {
  let calledUrl = '';
  let calledMethod = '';
  let sentBody = null;
  globalThis.fetch = async (url, opts) => {
    calledUrl = String(url);
    calledMethod = opts.method;
    sentBody = opts.body ? JSON.parse(opts.body) : null;
    return jsonResponse(201, { success: true, data: { plan: { id: 7 } } });
  };

  await planInternetService.createPlan({ nombre_plan: 'Plan Nuevo', velocidad_mbps: 80, precio_mensual: 200 });
  assert.ok(calledUrl.endsWith('/planes'));
  assert.equal(calledMethod, 'POST');
  assert.equal(sentBody.nombre_plan, 'Plan Nuevo');

  await planInternetService.updatePlan(7, { activo: true });
  assert.ok(calledUrl.endsWith('/planes/7'));
  assert.equal(calledMethod, 'PUT');
  assert.deepEqual(sentBody, { activo: true });

  await planInternetService.desactivarPlan(7);
  assert.ok(calledUrl.endsWith('/planes/7'));
  assert.equal(calledMethod, 'DELETE');
});

test('CU16 un error del backend NO se sustituye por datos de ejemplo', async () => {
  stubFetch(jsonResponse(403, { success: false, message: 'Prohibido' }));
  await assert.rejects(planInternetService.fetchPlanes(), (err) => err.status === 403);
});

test('CU17 fetchServicios aplana el cliente de /cu08/servicios', async () => {
  stubFetch(jsonResponse(200, {
    success: true,
    data: {
      data: [
        { id: 1, codigo_servicio: 'SRV-1', cliente: { nombres: 'Ana', apellidos: 'Pérez' } },
      ],
    },
  }));
  const [servicio] = await asignacionPlanService.fetchServicios();
  assert.equal(servicio.cliente_nombre, 'Ana Pérez');
});

test('CU17 fetchHistorial lee data.servicio y data.asignaciones', async () => {
  let calledUrl = '';
  globalThis.fetch = async (url) => {
    calledUrl = String(url);
    return jsonResponse(200, {
      success: true,
      data: { servicio: { codigo_servicio: 'SRV-1' }, asignaciones: [{ id: 5 }] },
    });
  };
  const res = await asignacionPlanService.fetchHistorial(1);
  assert.ok(calledUrl.includes('/cu08/servicios/1/planes'));
  assert.equal(res.asignaciones.length, 1);
  assert.equal(res.servicio.codigo_servicio, 'SRV-1');
});

test('CU17 asignarPlan envía POST con plan_id y motivo', async () => {
  let calledUrl = '';
  let sentBody = null;
  globalThis.fetch = async (url, opts) => {
    calledUrl = String(url);
    sentBody = JSON.parse(opts.body);
    return jsonResponse(201, { success: true, data: { asignacion: { plan_id: 3 } } });
  };
  const res = await asignacionPlanService.asignarPlan(1, { plan_id: 3, motivo_cambio: 'Upgrade' });
  assert.ok(calledUrl.includes('/cu08/servicios/1/planes'));
  assert.equal(sentBody.plan_id, 3);
  assert.equal(res.data.asignacion.plan_id, 3);
});

test.after(() => {
  delete globalThis.__TELCOM_DEMO__;
});

