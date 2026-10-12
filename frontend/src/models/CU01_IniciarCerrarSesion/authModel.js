import { apiClient } from '../../services/apiClient';

export const initialAuthCredentials = {
  email: '',
  password: '',
};

export const authService = {
  async login(credentials) {
    const res = await apiClient.post('/cu01/login', credentials);
    if (res?.data?.token) {
      localStorage.setItem('telcom_token', res.data.token);
      localStorage.setItem('telcom_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async logout() {
    await apiClient.post('/cu01/logout');
    localStorage.removeItem('telcom_token');
    localStorage.removeItem('telcom_user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('telcom_user');
    return user ? JSON.parse(user) : { name: 'Admin Telecom', email: 'admin@telcom.com', role: 'Administrador Senior' };
  }
};
