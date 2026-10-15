import { apiClient } from '../../../../services/apiClient.js';
import { isDemoMode } from '../../../../config/appConfig.js';

// Datos de ejemplo SOLO para el modo demostración (desactivado por defecto).
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

// La API devuelve la relación `cliente`; se aplana para la vista.
function normalizeServicio(s) {
  const cliente = s.cliente;
  return {
    ...s,
    cliente_nombre: s.cliente_nombre
      || (cliente ? `${cliente.nombres ?? ''} ${cliente.apellidos ?? ''}`.trim() : null),
  };
}

export const serviciosCorteService = {
  async fetchServiciosCorte() {
    if (isDemoMode()) return mockServiciosParaCorte;
    const res = await apiClient.get('/cu13/servicios-corte');
    return (res?.data?.data ?? []).map(normalizeServicio);
  }
};
