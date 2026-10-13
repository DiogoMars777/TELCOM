import { apiClient } from '../../services/apiClient.js';

export const pagoMensualidadService = {
  async registrarPago(data) {
    return await apiClient.post('/cu10/pagos', data);
  }
};
