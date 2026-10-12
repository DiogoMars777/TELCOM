import { useState } from 'react';
import { authService, initialAuthCredentials } from '../../models/CU01_IniciarCerrarSesion/authModel';

export function useAuthController(onLoginSuccess) {
  const [credentials, setCredentials] = useState(initialAuthCredentials);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(authService.getCurrentUser());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login(credentials);
      if (result && result.success !== false) {
        const loggedUser = authService.getCurrentUser();
        setUser(loggedUser);
        if (onLoginSuccess) onLoginSuccess(loggedUser);
      } else {
        setError(result?.message || 'Error al iniciar sesión.');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setLoading(false);
  };

  return {
    credentials,
    loading,
    error,
    user,
    handleChange,
    handleSubmit,
    handleLogout,
  };
}
