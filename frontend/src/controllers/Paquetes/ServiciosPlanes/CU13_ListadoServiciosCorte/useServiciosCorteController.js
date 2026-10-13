import { useState, useEffect } from 'react';
import { serviciosCorteService } from '../../../../models/Paquetes/ServiciosPlanes/CU13_ListadoServiciosCorte/servicioCorteModel';
import { describeApiError } from '../../../../services/apiClient';

export function useServiciosCorteController() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadServicios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviciosCorteService.fetchServiciosCorte();
      setServicios(data);
    } catch (e) {
      setServicios([]);
      setError(describeApiError(e));
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
    error,
    reload: loadServicios,
  };
}
