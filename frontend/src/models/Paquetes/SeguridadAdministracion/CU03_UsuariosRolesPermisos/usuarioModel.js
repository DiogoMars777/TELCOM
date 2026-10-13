import { apiClient } from '../../../../services/apiClient.js';
import { isDemoMode } from '../../../../config/appConfig.js';

// Datos de ejemplo SOLO para el modo demostración (desactivado por defecto).
export const mockUsuarios = [
  { id: 1, name: 'Administrador Senior TELCOM', email: 'admin@telcom.com', role: 'Administrador de Sistema', activo: true },
  { id: 2, name: 'Beatriz Morales', email: 'caja1@telcom.com', role: 'Cajero / Cobranzas', activo: true },
  { id: 3, name: 'Marcos Quiroga', email: 'tecnico1@telcom.com', role: 'Soporte Técnico', activo: true },
];

export const mockRoles = [
  { id: 1, nombre: 'Administrador de Sistema', slug: 'admin', permisos: [] },
  { id: 2, nombre: 'Secretaría', slug: 'secretaria', permisos: [] },
  { id: 3, nombre: 'Soporte Técnico', slug: 'tecnico', permisos: [] },
];

export const usuarioService = {
  async fetchUsuarios() {
    if (isDemoMode()) return mockUsuarios;
    const res = await apiClient.get('/cu03/usuarios');
    return res?.data?.usuarios?.data ?? [];
  },

  // El endpoint entrega usuarios (paginados) y roles en la misma respuesta.
  async fetchUsuariosYRoles() {
    if (isDemoMode()) return { usuarios: mockUsuarios, roles: mockRoles };
    const res = await apiClient.get('/cu03/usuarios');
    return {
      usuarios: res?.data?.usuarios?.data ?? [],
      roles: res?.data?.roles ?? [],
    };
  },

  async createUsuario(data) {
    return await apiClient.post('/cu03/usuarios', data);
  },

  // Activar/desactivar (y otros campos) con el body parcial.
  async actualizarUsuario(id, data) {
    return await apiClient.put(`/cu03/usuarios/${id}`, data);
  },

  async cambiarRol(id, rolId) {
    return await apiClient.put(`/cu03/usuarios/${id}/rol`, { rol_id: rolId });
  }
};
