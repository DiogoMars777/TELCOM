import { useState, useEffect } from 'react';
import { historialPagosService } from '../../models/CU11_ConsultarHistorialPagos/historialPagoModel';
import { describeApiError } from '../../services/apiClient';

export function useHistorialPagosController() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metodoFiltro, setMetodoFiltro] = useState('');

  const loadHistorial = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await historialPagosService.fetchHistorial({ metodo_pago: metodoFiltro });
      const filtered = data.filter(p => !metodoFiltro || p.metodo_pago === metodoFiltro);
      setPagos(filtered);
    } catch (e) {
      setPagos([]);
      setError(describeApiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistorial();
  }, [metodoFiltro]);

  return {
    pagos,
    loading,
    error,
    metodoFiltro,
    setMetodoFiltro,
    reload: loadHistorial,
  };
}
