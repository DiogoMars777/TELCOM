/**
 * Autenticación real con Laravel Sanctum (CU01).
 * -------------------------------------------------------------------
 * Login -> guarda el token Bearer. Logout -> lo revoca y lo borra.
 * `getCurrentUser` ya NO devuelve un usuario simulado: sin sesión, es null.
 */

import { apiClient, authToken } from '../../../../services/apiClient.js';

export const initialAuthCredentials = {
  email: '',
  password: '',
};

const USER_KEY = 'telcom_user';

export const authService = {
  async login(credentials) {
    const res = await apiClient.post('/cu01/login', credentials, { throwOnError: true });

    if (res?.data?.token) {
      authToken.set(res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    }

    return res?.data?.user ?? null;
  },

  async logout() {
    try {
      await apiClient.post('/cu01/logout', {}, { throwOnError: true });
    } catch {
      // El token pudo haber expirado; de todos modos cerramos la sesión local.
    }
    authToken.clear();
    localStorage.removeItem(USER_KEY);
  },

  async fetchCurrentUser() {
    const res = await apiClient.get('/cu01/me', {}, { throwOnError: true });
    return res?.data ?? null;
  },

  getToken() {
    return authToken.get();
  },

  getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clear() {
    authToken.clear();
    localStorage.removeItem(USER_KEY);
  },
};
