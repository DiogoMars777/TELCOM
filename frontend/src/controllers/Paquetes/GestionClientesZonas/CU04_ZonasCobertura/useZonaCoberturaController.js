import { useState, useEffect } from 'react';
import { zonaService } from '../../../../models/Paquetes/GestionClientesZonas/CU04_ZonasCobertura/zonaCoberturaModel';
import { describeApiError } from '../../../../services/apiClient';

const emptyZona = {
  codigo: '',
  nombre: '',
  ciudad: 'La Paz',
  tecnologia: 'FTTH GPON',
  capacidad_nodos: 100,
};

export function useZonaCoberturaController() {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);       // Error de carga del listado
  const [formError, setFormError] = useState(null); // Error al crear una zona
  const [showModal, setShowModal] = useState(false);
  const [newZona, setNewZona] = useState(emptyZona);

  const loadZonas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await zonaService.fetchZonas();
      setZonas(data);
    } catch (e) {
      setZonas([]);
      setError(describeApiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZonas();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    try {
      await zonaService.createZona(newZona);
      // Solo se cierra el modal y se recarga cuando el backend confirmó.
      setShowModal(false);
      setNewZona(emptyZona);
      await loadZonas();
    } catch (err) {
      setFormError(describeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    zonas,
    loading,
    error,
    formError,
    showModal,
    setShowModal,
    newZona,
    setNewZona,
    handleCreate,
    reload: loadZonas,
  };
}
