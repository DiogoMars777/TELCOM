import { useState, useEffect } from 'react';
import { alertasService, mockAlertas } from '../../models/CU12_VisualizarAlertasVencimiento/alertaVencimientoModel';

export function useAlertasVencimientoController() {
  const [alertas, setAlertas] = useState(mockAlertas);
  const [loading, setLoading] = useState(false);
  const [severidadFiltro, setSeveridadFiltro] = useState('');

  const loadAlertas = async () => {
    setLoading(true);
    try {
      const data = await alertasService.fetchAlertas();
      const filtered = data.filter(a => !severidadFiltro || a.severidad === severidadFiltro);
      setAlertas(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertas();
  }, [severidadFiltro]);

  return {
    alertas,
    loading,
    severidadFiltro,
    setSeveridadFiltro,
    reload: loadAlertas,
  };
}
