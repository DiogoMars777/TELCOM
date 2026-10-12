import { useState, useEffect } from 'react';
import { auditoriaService, mockAuditoriaLogs } from '../../models/CU02_BitacoraAuditoria/auditoriaModel';

export function useAuditoriaController() {
  const [logs, setLogs] = useState(mockAuditoriaLogs);
  const [loading, setLoading] = useState(false);
  const [moduloFiltro, setModuloFiltro] = useState('');
  const [accionFiltro, setAccionFiltro] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await auditoriaService.fetchLogs({
        modulo: moduloFiltro,
        accion: accionFiltro,
      });
      setLogs(data);
    } catch (err) {
      console.error('Error cargando bitácora:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [moduloFiltro, accionFiltro]);

  return {
    logs,
    loading,
    moduloFiltro,
    setModuloFiltro,
    accionFiltro,
    setAccionFiltro,
    reload: loadLogs,
  };
}
