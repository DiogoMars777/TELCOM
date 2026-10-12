import { apiClient } from '../../services/apiClient';

export const mockClientesList = [
  {
    id: 1,
    codigo_cliente: 'CLI-10001',
    documento_identidad: '8492019',
    nombres: 'Carlos Andrés',
    apellidos: 'Mendoza Paredes',
    telefono: '+591 76543210',
    email: 'carlos.mendoza@email.com',
    direccion: 'Av. Siempre Viva #742',
    estado: 'ACTIVO',
    zona_nombre: 'Zona Norte',
  },
  {
    id: 2,
    codigo_cliente: 'CLI-10002',
    documento_identidad: '5318921',
    nombres: 'Valeria',
    apellidos: 'Rojas Silva',
    telefono: '+591 71239841',
    email: 'valeria.rojas@email.com',
    direccion: 'Calle Los Pinos #12',
    estado: 'ACTIVO',
    zona_nombre: 'Zona Sur',
  },
  {
    id: 3,
    codigo_cliente: 'CLI-10003',
    documento_identidad: '4928102',
    nombres: 'Fernando',
    apellidos: 'Torres Gutierrez',
    telefono: '+591 69821455',
    email: 'fernando.torres@email.com',
    direccion: 'Barrio Central #88',
    estado: 'SUSPENDIDO',
    zona_nombre: 'Zona Central',
  },
];

export const clienteConsultaService = {
  async fetchClientes(params = {}) {
    const res = await apiClient.get('/cu06/clientes', params);
    return res?.data?.data || mockClientesList;
  }
};
