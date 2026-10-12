import { apiClient } from '../../services/apiClient';

export const mockHistorialPagos = [
  {
    id: 1,
    codigo_recibo: 'REC-202609-101',
    factura_codigo: 'FAC-2026-09-B12',
    cliente_nombre: 'Carlos Andrés Mendoza',
    monto_pagado: 220.00,
    metodo_pago: 'QR',
    numero_transaccion: 'QR-BNB-88391',
    fecha_pago: '2026-09-08 11:20:00',
    cajero_nombre: 'Beatriz Morales',
  },
  {
    id: 2,
    codigo_recibo: 'REC-202608-044',
    factura_codigo: 'FAC-2026-08-A01',
    cliente_nombre: 'Valeria Rojas Silva',
    monto_pagado: 160.00,
    metodo_pago: 'EFECTIVO',
    numero_transaccion: 'CAJA-01',
    fecha_pago: '2026-08-05 09:14:32',
    cajero_nombre: 'Beatriz Morales',
  },
];

export const historialPagosService = {
  async fetchHistorial(filters = {}) {
    const res = await apiClient.get('/cu11/historial', filters);
    return res?.data?.data || mockHistorialPagos;
  }
};
