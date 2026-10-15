import { apiClient } from '../../../../services/apiClient.js';
import { isDemoMode } from '../../../../config/appConfig.js';

/**
 * CU17 - Modelo para asignar o cambiar el plan de un servicio.
 *
 * Reutiliza el contrato existente (el mismo que usa CU08):
 *   - GET  /cu08/servicios                    -> lista de servicios (paginada)
 *   - GET  /planes                            -> catálogo de planes
 *   - GET  /cu08/servicios/{id}/planes        -> historial del servicio
 *   - POST /cu08/servicios/{id}/planes        -> asignar/cambiar plan
 */

// Datos de ejemplo SOLO para el modo demostración (desactivado por defecto).
export const mockServiciosCu17 = [
  {
    id: 1,
    codigo_servicio: 'SRV-88201',
    cliente_nombre: 'Carlos Andrés Mendoza',
    plan_nombre: 'Plan Fibra Ultra 100 Mbps',
    velocidad_mbps: 100,
    precio_mensual: 220.0,
    estado_servicio: 'ACTIVO',
  },
  {
    id: 2,
    codigo_servicio: 'SRV-88202',
    cliente_nombre: 'Valeria Rojas Silva',
    plan_nombre: 'Plan Hogar Plus 50 Mbps',
    velocidad_mbps: 50,
    precio_mensual: 160.0,
    estado_servicio: 'PENDIENTE_INSTALACION',
  },
];

export const mockPlanesCu17 = [
  { id: 1, nombre_plan: 'Plan Básico 30 Mbps', velocidad_mbps: 30, precio_mensual: 130.0, activo: true },
  { id: 2, nombre_plan: 'Plan Hogar Plus 50 Mbps', velocidad_mbps: 50, precio_mensual: 160.0, activo: true },
  { id: 3, nombre_plan: 'Plan Fibra Ultra 100 Mbps', velocidad_mbps: 100, precio_mensual: 220.0, activo: true },
];

export const mockHistorialCu17 = {
  1: [
    {
      id: 1,
      plan: { id: 3, nombre_plan: 'Plan Fibra Ultra 100 Mbps', velocidad_mbps: 100 },
      precio_aplicado: '220.00',
      fecha_inicio: '2026-01-01',
      fecha_fin: null,
      motivo_cambio: 'Contratación inicial del servicio.',
      usuario: { id: 1, name: 'Administrador Senior TELCOM' },
    },
  ],
};

// La API entrega la relación `cliente`; la vista usa `cliente_nombre`.
function nombreCliente(servicio) {
  if (servicio.cliente_nombre) return servicio.cliente_nombre;
  if (servicio.cliente) {
    return `${servicio.cliente.nombres ?? ''} ${servicio.cliente.apellidos ?? ''}`.trim();
  }
  return null;
}

// Los planes pueden venir con nombres canónicos o alias snake_case.
function normalizarPlan(p) {
  return {
    id: p.id ?? p.idPlan ?? null,
    nombre_plan: p.nombre_plan ?? p.nombrePlan ?? '',
    velocidad_mbps: p.velocidad_mbps ?? p.velocidadMbps ?? null,
    precio_mensual: p.precio_mensual ?? p.precioMensual ?? null,
    activo: p.activo === undefined || p.activo === null ? true : Boolean(p.activo),
  };
}

export const asignacionPlanService = {
  async fetchServicios() {
    if (isDemoMode()) return mockServiciosCu17;
    const res = await apiClient.get('/cu08/servicios');
    return (res?.data?.data ?? []).map((s) => ({ ...s, cliente_nombre: nombreCliente(s) }));
  },

  async fetchPlanes() {
    if (isDemoMode()) return mockPlanesCu17.map(normalizarPlan);
    const res = await apiClient.get('/planes');
    return (res?.data?.planes ?? []).map(normalizarPlan);
  },

  async fetchHistorial(servicioId) {
    if (isDemoMode()) {
      return {
        servicio: mockServiciosCu17.find((s) => s.id === Number(servicioId)) ?? null,
        asignaciones: mockHistorialCu17[servicioId] ?? [],
      };
    }
    const res = await apiClient.get(`/cu08/servicios/${servicioId}/planes`);
    return res?.data ?? { servicio: null, asignaciones: [] };
  },

  async asignarPlan(servicioId, data) {
    return await apiClient.post(`/cu08/servicios/${servicioId}/planes`, data);
  },
};
