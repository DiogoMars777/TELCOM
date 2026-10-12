import { useState, useEffect } from 'react';
import { reactivacionesService, mockReactivacionesList } from '../../models/CU15_ListaRegistroReactivaciones/reactivacionesModel';

export function useReactivacionesController() {
  const [reactivaciones, setReactivaciones] = useState(mockReactivacionesList);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formReactivacion, setFormReactivacion] = useState({
    servicio_id: 1,
    costo_reactivacion: 50.00,
    observaciones: 'Pago confirmado por ventanilla',
  });

  const loadReactivaciones = async () => {
    setLoading(true);
    try {
      const data = await reactivacionesService.fetchReactivaciones();
      setReactivaciones(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReactivaciones();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reactivacionesService.registrarReactivacion(formReactivacion);
      setReactivaciones(prev => [
        ...prev,
        {
          id: Date.now(),
          codigo_reactivacion: 'REA-202610-' + Math.floor(100 + Math.random() * 900),
          servicio_codigo: 'SRV-88201',
          cliente_nombre: 'Fernando Torres',
          costo_reactivacion: formReactivacion.costo_reactivacion,
          fecha_reactivacion: new Date().toLocaleString(),
          operador_nombre: 'Admin Telecom',
          observaciones: formReactivacion.observaciones,
        }
      ]);
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    reactivaciones,
    loading,
    showModal,
    setShowModal,
    formReactivacion,
    setFormReactivacion,
    handleCrear,
    reload: loadReactivaciones,
  };
}
