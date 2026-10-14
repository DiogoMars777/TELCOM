import { apiClient } from '../../../../services/apiClient.js';
import { isDemoMode } from '../../../../config/appConfig.js';

/**
 * CU16 - Catálogo de planes de Internet (entidad UML PlanInternet).
 *
 * Capa de datos real: cada función llama a la API y propaga los errores tal
 * cual (nunca los sustituye por datos ficticios). Los mocks solo se usan con
 * el modo demostración ACTIVADO de forma explícita (desactivado por defecto).
 */

// Datos de ejemplo SOLO para el modo demostración (desactivado por defecto).
export const mockPlanesCatalogo = [
  { id: 1, nombre_plan: 'Plan Básico 30 Mbps', velocidad_mbps: 30, precio_mensual: '130.00', descripcion: 'Hogar básico', activo: true },
  { id: 2, nombre_plan: 'Plan Hogar Plus 50 Mbps', velocidad_mbps: 50, precio_mensual: '160.00', descripcion: 'Hogar plus', activo: true },
];

export const planInternetService = {
  async fetchPlanes(params = {}) {
    if (isDemoMode()) return mockPlanesCatalogo;
    const res = await apiClient.get('/planes', params);
    return res?.data?.planes ?? [];
  },

  async fetchPlan(id) {
    if (isDemoMode()) return mockPlanesCatalogo.find((p) => p.id === Number(id)) ?? null;
    const res = await apiClient.get(`/planes/${id}`);
    return res?.data?.plan ?? null;
  },

  async crearPlan(data) {
    const res = await apiClient.post('/planes', data);
    return res?.data?.plan;
  },

  async actualizarPlan(id, data) {
    const res = await apiClient.put(`/planes/${id}`, data);
    return res?.data?.plan;
  },

  async activarPlan(id) {
    const res = await apiClient.put(`/planes/${id}/activar`);
    return res?.data?.plan;
  },

  async desactivarPlan(id) {
    const res = await apiClient.put(`/planes/${id}/desactivar`);
    return res?.data?.plan;
  },
};
