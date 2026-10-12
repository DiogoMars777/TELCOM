import { useState, useEffect } from 'react';
import { serviciosCorteService, mockServiciosParaCorte } from '../../models/CU13_ListadoServiciosCorte/servicioCorteModel';

export function useServiciosCorteController() {
  const [servicios, setServicios] = useState(mockServiciosParaCorte);
  const [loading, setLoading] = useState(false);

  const loadServicios = async () => {
    setLoading(true);
    try {
      const data = await serviciosCorteService.fetchServiciosCorte();
      setServicios(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServicios();
  }, []);

  return {
    servicios,
    loading,
    reload: loadServicios,
  };
}
