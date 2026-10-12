import { useState, useEffect } from 'react';
import { zonaService, mockZonas } from '../../models/CU04_ZonasCobertura/zonaCoberturaModel';

export function useZonaCoberturaController() {
  const [zonas, setZonas] = useState(mockZonas);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newZona, setNewZona] = useState({
    codigo: '',
    nombre: '',
    ciudad: 'La Paz',
    tecnologia: 'FTTH GPON',
    capacidad_nodos: 100,
  });

  const loadZonas = async () => {
    setLoading(true);
    try {
      const data = await zonaService.fetchZonas();
      setZonas(data);
    } catch (e) {
      console.error(e);
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
    try {
      await zonaService.createZona(newZona);
      setZonas(prev => [...prev, { ...newZona, id: Date.now(), activo: true }]);
      setShowModal(false);
      setNewZona({ codigo: '', nombre: '', ciudad: 'La Paz', tecnologia: 'FTTH GPON', capacidad_nodos: 100 });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    zonas,
    loading,
    showModal,
    setShowModal,
    newZona,
    setNewZona,
    handleCreate,
    reload: loadZonas,
  };
}
