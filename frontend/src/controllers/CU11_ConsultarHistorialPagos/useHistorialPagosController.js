import { useState, useEffect } from 'react';
import { historialPagosService, mockHistorialPagos } from '../../models/CU11_ConsultarHistorialPagos/historialPagoModel';

export function useHistorialPagosController() {
  const [pagos, setPagos] = useState(mockHistorialPagos);
  const [loading, setLoading] = useState(false);
  const [metodoFiltro, setMetodoFiltro] = useState('');

  const loadHistorial = async () => {
    setLoading(true);
    try {
      const data = await historialPagosService.fetchHistorial({ metodo_pago: metodoFiltro });
      const filtered = data.filter(p => !metodoFiltro || p.metodo_pago === metodoFiltro);
      setPagos(filtered);
    } catch (e) {
      console.error(e);
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
    metodoFiltro,
    setMetodoFiltro,
    reload: loadHistorial,
  };
}
