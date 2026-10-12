import { apiClient } from '../../services/apiClient';

export const mockReactivacionesList = [
  {
    id: 1,
    codigo_reactivacion: 'REA-202610-001',
    servicio_codigo: 'SRV-44102',
    cliente_nombre: 'Fernando Torres Gutierrez',
    costo_reactivacion: 50.00,
    fecha_reactivacion: '2026-10-12 14:10:00',
    operador_nombre: 'Beatriz Morales',
    observaciones: 'Reactivado tras cancelación total de deuda con comprobante QR',
  },
];

export const reactivacionesService = {
  async fetchReactivaciones() {
    const res = await apiClient.get('/cu15/reactivaciones');
    return res?.data?.data || mockReactivacionesList;
  },

  async registrarReactivacion(data) {
    return await apiClient.post('/cu15/reactivaciones', data);
  }
};
