import { apiClient } from '../../../../services/apiClient.js';
import { isDemoMode } from '../../../../config/appConfig.js';

// Datos de ejemplo SOLO para el modo demostración (desactivado por defecto).
export const mockServiciosParaCorte = [
  {
    id: 1,
    codigo_servicio: 'SRV-88201',
    cliente_nombre: 'Fernando Torres Gutierrez',
    cliente_ci: '4839201 LP',
    cliente_telefono: '70012345',
    zona_id: 1,
    zona_nombre: 'Zona Norte',
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
    cliente_ci: '5928103 SC',
    cliente_telefono: '76543210',
    zona_id: 2,
    zona_nombre: 'Zona Central',
    plan_nombre: 'Plan Fibra Ultra 100 Mbps',
    ip_asignada: '192.168.10.92',
    dias_mora: 12,
    monto_deuda: 220.00,
    estado_servicio: 'ACTIVO',
  },
];

// La API devuelve relaciones y atributos calculados; se asegura normalización para la vista.
function normalizeServicio(s) {
  const cliente = s.cliente;
  const zona = s.zona;
  return {
    ...s,
    cliente_nombre: s.cliente_nombre
      || (cliente ? `${cliente.nombres ?? ''} ${cliente.apellidos ?? ''}`.trim() : null)
      || cliente?.nombreCompleto
      || 'Abonado no especificado',
    cliente_ci: s.cliente_ci || cliente?.ci || cliente?.documento_identidad || '—',
    cliente_telefono: s.cliente_telefono || cliente?.telefonoPrincipal || cliente?.telefono || '—',
    zona_nombre: s.zona_nombre || zona?.nombreZona || zona?.nombre || 'Sin zona asignada',
  };
}

export const serviciosCorteService = {
  async fetchServiciosCorte(filters = {}) {
    if (isDemoMode()) {
      let result = [...mockServiciosParaCorte];
      if (filters.dias_mora) {
        result = result.filter(s => s.dias_mora >= Number(filters.dias_mora));
      }
      if (filters.zona_id) {
        result = result.filter(s => String(s.zona_id) === String(filters.zona_id));
      }
      if (filters.buscar) {
        const q = filters.buscar.toLowerCase();
        result = result.filter(s =>
          s.codigo_servicio?.toLowerCase().includes(q) ||
          s.cliente_nombre?.toLowerCase().includes(q) ||
          s.cliente_ci?.toLowerCase().includes(q) ||
          s.ip_asignada?.toLowerCase().includes(q)
        );
      }
      return result;
    }

    const params = new URLSearchParams();
    if (filters.dias_mora !== undefined && filters.dias_mora !== '') {
      params.append('dias_mora', filters.dias_mora);
    }
    if (filters.zona_id) {
      params.append('zona_id', filters.zona_id);
    }
    if (filters.buscar) {
      params.append('buscar', filters.buscar);
    }
    if (filters.todos) {
      params.append('todos', '1');
    }

    const qs = params.toString();
    const endpoint = `/cu13/servicios-corte${qs ? `?${qs}` : ''}`;
    const res = await apiClient.get(endpoint);

    const rawList = Array.isArray(res?.data)
      ? res.data
      : (res?.data?.data ?? []);

    return rawList.map(normalizeServicio);
  }
};
