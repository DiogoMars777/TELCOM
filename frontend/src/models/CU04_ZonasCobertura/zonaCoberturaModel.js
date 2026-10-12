import { apiClient } from '../../services/apiClient';

export const mockZonas = [
  { id: 1, codigo: 'ZON-NORTE', nombre: 'Zona Norte - Fibra Troncal', ciudad: 'La Paz / El Alto', tecnologia: 'FTTH GPON', capacidad_nodos: 500, activo: true },
  { id: 2, codigo: 'ZON-SUR', nombre: 'Zona Sur - Anillo Metropolitano', ciudad: 'Santa Cruz', tecnologia: 'FTTH GPON', capacidad_nodos: 800, activo: true },
  { id: 3, codigo: 'ZON-CENTRO', nombre: 'Zona Central - Casco Viejo', ciudad: 'Cochabamba', tecnologia: 'Radioenlace 5GHz', capacidad_nodos: 200, activo: true },
];

export const zonaService = {
  async fetchZonas() {
    const res = await apiClient.get('/cu04/zonas');
    return res?.data?.data || mockZonas;
  },

  async createZona(data) {
    return await apiClient.post('/cu04/zonas', data);
  }
};
