import { useState, useEffect } from 'react';
import { auditoriaService } from '../../../../models/Paquetes/SeguridadAdministracion/CU02_BitacoraAuditoria/auditoriaModel';
import { describeApiError } from '../../../../services/apiClient';

export function useAuditoriaController() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moduloFiltro, setModuloFiltro] = useState('');
  const [accionFiltro, setAccionFiltro] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditoriaService.fetchLogs({
        modulo: moduloFiltro,
        accion: accionFiltro,
      });
      setLogs(data);
    } catch (err) {
      setLogs([]);
      setError(describeApiError(err));
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
    error,
    moduloFiltro,
    setModuloFiltro,
    accionFiltro,
    setAccionFiltro,
    reload: loadLogs,
  };
}
