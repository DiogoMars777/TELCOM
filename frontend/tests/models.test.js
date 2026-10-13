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
const { zonaService, mockZonas } = await import('../src/models/CU04_ZonasCobertura/zonaCoberturaModel.js');
const { clienteConsultaService } = await import('../src/models/CU06_ConsultarBuscarClientes/clienteConsultaModel.js');
const { mensualidadService } = await import('../src/models/CU09_GenerarMensualidades/mensualidadModel.js');
const { alertasService } = await import('../src/models/CU12_VisualizarAlertasVencimiento/alertaVencimientoModel.js');

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

test.after(() => {
  delete globalThis.__TELCOM_DEMO__;
});
