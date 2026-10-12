import { useState, useEffect } from 'react';
import { mensualidadService, mockMensualidades } from '../../models/CU09_GenerarMensualidades/mensualidadModel';

export function useMensualidadGeneracionController() {
  const [mensualidades, setMensualidades] = useState(mockMensualidades);
  const [periodo, setPeriodo] = useState('2026-10');
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);

  const loadMensualidades = async () => {
    setLoading(true);
    try {
      const data = await mensualidadService.fetchMensualidades(periodo);
      setMensualidades(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMensualidades();
  }, [periodo]);

  const handleGenerar = async () => {
    setLoading(true);
    setResultMsg(null);
    try {
      const res = await mensualidadService.generarMensualidades(periodo);
      setResultMsg({
        type: 'success',
        text: res?.message || `Mensualidades para el período ${periodo} procesadas exitosamente.`,
      });
      loadMensualidades();
    } catch (err) {
      setResultMsg({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return {
    mensualidades,
    periodo,
    setPeriodo,
    loading,
    resultMsg,
    handleGenerar,
    reload: loadMensualidades,
  };
}
