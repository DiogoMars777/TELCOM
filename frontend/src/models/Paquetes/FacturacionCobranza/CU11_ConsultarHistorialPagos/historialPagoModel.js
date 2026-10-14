import { apiClient } from '../../../../services/apiClient.js';
import { isDemoMode } from '../../../../config/appConfig.js';

export const mockHistorialPagos = [{
  id: 1,
  codigo_recibo: 'REC-2026-0001',
  monto_pagado: 200,
  metodo_pago: 'QR',
  fecha_pago: '2026-10-13 10:30:00',
  cajero_nombre: 'Secretaría TELCOM',
  cliente_nombre: 'Cliente de demostración',
  cliente_codigo: 'CLI-001',
  servicio_codigo: 'SRV-001',
  periodos: ['2026-10'],
  detalles: [],
}];

function normalizePago(pago) {
  const detalles = pago.detalles || [];
  const mensualidades = detalles.map((detalle) => detalle.mensualidad).filter(Boolean);
  const primera = mensualidades[0] || pago.mensualidad || {};
  const cliente = primera.cliente || {};
  const servicio = primera.servicio || {};
  const metodoRelacionado = typeof pago.metodo_pago === 'object'
    ? pago.metodo_pago?.nombreMetodo
    : null;
  return {
    ...pago,
    id: pago.id ?? pago.idPago,
    codigo_recibo: pago.codigo_recibo || pago.numeroComprobante || `REC-${pago.idPago}`,
    monto_pagado: Number(pago.monto_pagado ?? pago.montoTotal ?? 0),
    metodo_pago: (typeof pago.metodo_pago === 'string' ? pago.metodo_pago : null)
      || metodoRelacionado || pago.metodoPago?.nombreMetodo || 'No especificado',
    fecha_pago: pago.fecha_pago || pago.fechaHora,
    numero_transaccion: pago.numero_transaccion || null,
    observaciones: pago.observaciones || pago.observacion || null,
    cajero_nombre: pago.cajero_nombre || pago.cajero?.name || pago.cajero?.nombreCompleto || 'Sistema',
    cliente_nombre: cliente.nombre_completo || cliente.nombreCompleto
      || `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim() || 'Sin cliente',
    cliente_codigo: cliente.codigo_cliente || cliente.codigoCliente || null,
    cliente_ci: cliente.documento_identidad || cliente.ci || null,
    servicio_codigo: servicio.codigo_servicio || servicio.codigoServicio || null,
    servicio_id: servicio.id || servicio.idServicio || primera.servicio_id || primera.idServicio,
    periodos: [...new Set(mensualidades.map((m) => m.periodo).filter(Boolean))],
    mensualidades,
    detalles,
  };
}

export const historialPagosService = {
  async fetchHistorial(filters = {}) {
    if (isDemoMode()) return { pagos: mockHistorialPagos, meta: { current_page: 1, last_page: 1, total: 1 } };
    const response = await apiClient.get('/cu11/historial', filters);
    const page = response?.data || {};
    return {
      pagos: (page.data || []).map(normalizePago),
      meta: {
        current_page: page.current_page || 1,
        last_page: page.last_page || 1,
        total: page.total || 0,
        from: page.from || 0,
        to: page.to || 0,
      },
    };
  },

  async fetchFiltros() {
    if (isDemoMode()) return { servicios: [], metodos: ['EFECTIVO', 'QR'] };
    const response = await apiClient.get('/cu11/historial/filtros');
    return response?.data || { servicios: [], metodos: [] };
  },

  async fetchDetalle(id) {
    if (isDemoMode()) return mockHistorialPagos.find((p) => p.id === Number(id));
    const response = await apiClient.get(`/cu11/historial/${id}`);
    return normalizePago(response?.data || {});
  },
};
