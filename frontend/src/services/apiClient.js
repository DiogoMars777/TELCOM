/**
 * Cliente HTTP base para TELCOM
 * Conecta con el Backend Laravel (PostgreSQL) y provee fallback resiliente
 */

const BASE_URL = 'http://localhost:8000/api';

export const apiClient = {
  async get(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const token = localStorage.getItem('telcom_token');
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`[API] Fallback local para GET ${endpoint}:`, error.message);
      return null;
    }
  },

  async post(endpoint, data = {}) {
    try {
      const token = localStorage.getItem('telcom_token');
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`[API] Operación local simulada para POST ${endpoint}:`, error.message);
      return { success: true, message: 'Operación simulada en modo local', data };
    }
  },

  async put(endpoint, data = {}) {
    try {
      const token = localStorage.getItem('telcom_token');
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`[API] Operación local simulada para PUT ${endpoint}:`, error.message);
      return { success: true, message: 'Actualización local simulada', data };
    }
  },

  async delete(endpoint) {
    try {
      const token = localStorage.getItem('telcom_token');
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`[API] Operación local simulada para DELETE ${endpoint}:`, error.message);
      return { success: true, message: 'Eliminación local simulada' };
    }
  }
};
