import { apiClient } from '../../services/apiClient';

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

export const servicioInternetService = {
  async fetchServicios() {
    const res = await apiClient.get('/cu08/servicios');
    return res?.data?.data || mockServiciosList;
  },

  async registrarServicio(data) {
    return await apiClient.post('/cu08/servicios', data);
  },

  async activarServicio(id, technicalData) {
    return await apiClient.put(`/cu08/servicios/${id}/activar`, technicalData);
  }
};
