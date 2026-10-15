import { apiClient } from '../../../../services/apiClient.js';
import { isDemoMode } from '../../../../config/appConfig.js';

/**
 * CU16 - Modelo del catálogo de Planes de Internet.
 * Reutiliza el endpoint real `/planes` (mismo contrato que ya consume CU08:
 * `{ data: { planes: [...] } }`).
 */

// Datos de ejemplo SOLO para el modo demostración (desactivado por defecto).
export const mockPlanesCu16 = [
  {
    id: 1,
    nombre_plan: 'Plan Básico 30 Mbps',
    velocidad_mbps: 30,
    precio_mensual: 130.0,
    descripcion: 'Hogar básico',
    activo: true,
  },
  {
    id: 2,
    nombre_plan: 'Plan Hogar Plus 50 Mbps',
    velocidad_mbps: 50,
    precio_mensual: 160.0,
    descripcion: 'Hogar plus',
    activo: true,
  },
  {
    id: 3,
    nombre_plan: 'Plan Fibra Ultra 100 Mbps',
    velocidad_mbps: 100,
    precio_mensual: 220.0,
    descripcion: 'Fibra ultra',
    activo: false,
  },
];

/**
 * Normaliza un plan del backend. El modelo expone tanto los campos canónicos
 * (`nombrePlan`, `velocidadMbps`...) como los alias snake_case; se aceptan
 * ambos sin inventar valores.
 */
export function normalizePlan(p) {
  return {
    ...p,
    id: p.id ?? p.idPlan ?? null,
    nombre_plan: p.nombre_plan ?? p.nombrePlan ?? '',
    velocidad_mbps: p.velocidad_mbps ?? p.velocidadMbps ?? null,
    precio_mensual: p.precio_mensual ?? p.precioMensual ?? null,
    descripcion: p.descripcion ?? '',
    activo: p.activo === undefined || p.activo === null ? true : Boolean(p.activo),
  };
}

export const planInternetService = {
  async fetchPlanes() {
    if (isDemoMode()) return mockPlanesCu16.map(normalizePlan);
    const res = await apiClient.get('/planes');
    const planes = res?.data?.planes ?? [];
    return planes.map(normalizePlan);
  },

  async createPlan(data) {
    return await apiClient.post('/planes', data);
  },

  async updatePlan(id, data) {
    return await apiClient.put(`/planes/${id}`, data);
  },

  // Baja lógica: el backend desactiva el plan (nunca lo borra).
  async desactivarPlan(id) {
    return await apiClient.delete(`/planes/${id}`);
  },
};
