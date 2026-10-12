import { apiClient } from '../../services/apiClient';

export const mockServiciosParaCorte = [
  {
    id: 1,
    codigo_servicio: 'SRV-88201',
    cliente_nombre: 'Fernando Torres Gutierrez',
    plan_nombre: 'Plan Corporativo 300 Mbps',
    ip_asignada: '192.168.10.88',
    dias_mora: 27,
    monto_deuda: 450.00,
    estado_servicio: 'ACTIVO',
  },
  {
    id: 2,
    codigo_servicio: 'SRV-88204',
    cliente_nombre: 'Juan Pablo Camacho',
    plan_nombre: 'Plan Fibra Ultra 100 Mbps',
    ip_asignada: '192.168.10.92',
    dias_mora: 12,
    monto_deuda: 220.00,
    estado_servicio: 'ACTIVO',
  },
];

export const serviciosCorteService = {
  async fetchServiciosCorte() {
    const res = await apiClient.get('/cu13/servicios-corte');
    return res?.data?.data || mockServiciosParaCorte;
  }
};
