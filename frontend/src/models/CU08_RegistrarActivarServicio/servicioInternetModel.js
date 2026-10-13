import { apiClient } from '../../services/apiClient.js';
import { isDemoMode } from '../../config/appConfig.js';

// Datos de ejemplo SOLO para el modo demostración (desactivado por defecto).
export const mockServiciosList = [
  {
    id: 1,
    codigo_servicio: 'SRV-88201',
    cliente_nombre: 'Carlos Andrés Mendoza',
    plan_nombre: 'Plan Fibra Ultra 100 Mbps',
    velocidad_mbps: 100,
    precio_mensual: 220.00,
    ip_asignada: '192.168.10.45',
    mac_router: 'E4:8D:8C:1A:2B:3C',
    dia_corte: 10,
    estado_servicio: 'ACTIVO',
  },
  {
    id: 2,
    codigo_servicio: 'SRV-88202',
    cliente_nombre: 'Valeria Rojas Silva',
    plan_nombre: 'Plan Hogar Plus 50 Mbps',
    velocidad_mbps: 50,
    precio_mensual: 160.00,
    ip_asignada: null,
    mac_router: null,
    dia_corte: 15,
    estado_servicio: 'PENDIENTE_INSTALACION',
  },
];

export const mockClientesCu08 = [
  { id: 1, codigo_cliente: 'CLI-10001', nombres: 'Carlos Andrés', apellidos: 'Mendoza Paredes', direccion: 'Av. Siempre Viva #742' },
  { id: 2, codigo_cliente: 'CLI-10002', nombres: 'Valeria', apellidos: 'Rojas Silva', direccion: 'Calle Los Pinos #12' },
];

export const mockPlanesCu08 = [
  { id: 1, nombre_plan: 'Plan Básico 30 Mbps', velocidad_mbps: 30, precio_mensual: 130.00, descripcion: 'Hogar básico', activo: true },
  { id: 2, nombre_plan: 'Plan Hogar Plus 50 Mbps', velocidad_mbps: 50, precio_mensual: 160.00, descripcion: 'Hogar plus', activo: true },
  { id: 3, nombre_plan: 'Plan Fibra Ultra 100 Mbps', velocidad_mbps: 100, precio_mensual: 220.00, descripcion: 'Fibra ultra', activo: true },
];

// La API entrega la relación `cliente`; la vista usa `cliente_nombre`.
function nombreCliente(servicio) {
  if (servicio.cliente_nombre) return servicio.cliente_nombre;
  if (servicio.cliente) {
    return `${servicio.cliente.nombres ?? ''} ${servicio.cliente.apellidos ?? ''}`.trim();
  }
  return null;
}

export const servicioInternetService = {
  async fetchServicios() {
    if (isDemoMode()) return mockServiciosList;
    const res = await apiClient.get('/cu08/servicios');
    return (res?.data?.data ?? []).map((s) => ({ ...s, cliente_nombre: nombreCliente(s) }));
  },

  async fetchClientes() {
    if (isDemoMode()) return mockClientesCu08;
    const res = await apiClient.get('/cu06/clientes');
    return res?.data?.data ?? [];
  },

  async fetchPlanes() {
    if (isDemoMode()) return mockPlanesCu08;
    const res = await apiClient.get('/planes');
    return res?.data?.planes ?? [];
  },

  async registrarServicio(data) {
    return await apiClient.post('/cu08/servicios', data);
  },

  async activarServicio(id, technicalData) {
    return await apiClient.put(`/cu08/servicios/${id}/activar`, technicalData);
  }
};
