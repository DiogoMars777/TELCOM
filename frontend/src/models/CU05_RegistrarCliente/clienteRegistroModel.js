import { apiClient } from '../../services/apiClient';

export const initialCliente = {
  documento_identidad: '',
  tipo_documento: 'CI',
  nombres: '',
  apellidos: '',
  telefono: '',
  email: '',
  direccion: '',
  zona_id: 1,
};

export const clienteRegistroService = {
  async registerCliente(data) {
    return await apiClient.post('/cu05/clientes', data);
  }
};
