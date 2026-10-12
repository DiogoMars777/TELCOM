import { apiClient } from '../../services/apiClient';

export const mockUsuarios = [
  { id: 1, name: 'Administrador Senior TELCOM', email: 'admin@telcom.com', role: 'Administrador de Sistema', activo: true },
  { id: 2, name: 'Beatriz Morales', email: 'caja1@telcom.com', role: 'Cajero / Cobranzas', activo: true },
  { id: 3, name: 'Marcos Quiroga', email: 'tecnico1@telcom.com', role: 'Soporte Técnico', activo: true },
];

export const usuarioService = {
  async fetchUsuarios() {
    const res = await apiClient.get('/cu03/usuarios');
    return res?.data?.usuarios?.data || mockUsuarios;
  },

  async createUsuario(data) {
    return await apiClient.post('/cu03/usuarios', data);
  }
};
