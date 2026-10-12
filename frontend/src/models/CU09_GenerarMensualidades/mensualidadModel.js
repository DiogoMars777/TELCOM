import { apiClient } from '../../services/apiClient';

export const mockMensualidades = [
  {
    id: 1,
    codigo_factura: 'FAC-2026-10-A91',
    cliente_nombre: 'Carlos Andrés Mendoza',
    servicio_codigo: 'SRV-88201',
    periodo: '2026-10',
    monto: 220.00,
    fecha_emision: '2026-10-01',
    fecha_vencimiento: '2026-10-10',
    estado_pago: 'PENDIENTE',
  },
  {
    id: 2,
    codigo_factura: 'FAC-2026-09-B12',
    cliente_nombre: 'Carlos Andrés Mendoza',
    servicio_codigo: 'SRV-88201',
    periodo: '2026-09',
    monto: 220.00,
    fecha_emision: '2026-09-01',
    fecha_vencimiento: '2026-09-10',
    estado_pago: 'PAGADO',
  },
];

export const mensualidadService = {
  async fetchMensualidades(periodo) {
    const res = await apiClient.get('/cu09/mensualidades', { periodo });
    return res?.data?.data || mockMensualidades;
  },

  async generarMensualidades(periodo) {
    return await apiClient.post('/cu09/mensualidades/generar', { periodo });
  }
};
