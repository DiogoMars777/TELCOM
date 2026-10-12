import { useState, useEffect } from 'react';
import { servicioInternetService, mockServiciosList } from '../../models/CU08_RegistrarActivarServicio/servicioInternetModel';

export function useServicioInternetController() {
  const [servicios, setServicios] = useState(mockServiciosList);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showActivarModal, setShowActivarModal] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);

  const [formServicio, setFormServicio] = useState({
    cliente_id: 1,
    plan_nombre: 'Plan Fibra Ultra 100 Mbps',
    velocidad_mbps: 100,
    precio_mensual: 220.00,
    direccion_instalacion: 'Av. Siempre Viva #742',
    dia_corte: 10,
  });

  const [formActivar, setFormActivar] = useState({
    ip_asignada: '192.168.10.50',
    mac_router: '00:1A:2B:3C:4D:5E',
  });

  const loadServicios = async () => {
    setLoading(true);
    try {
      const data = await servicioInternetService.fetchServicios();
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

  const handleCrear = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await servicioInternetService.registrarServicio(formServicio);
      setServicios(prev => [
        ...prev,
        {
          id: Date.now(),
          codigo_servicio: 'SRV-' + Math.floor(10000 + Math.random() * 90000),
          cliente_nombre: 'Cliente Nuevo',
          ...formServicio,
          estado_servicio: 'PENDIENTE_INSTALACION',
        }
      ]);
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActivar = async (e) => {
    e.preventDefault();
    if (!selectedServicio) return;
    setLoading(true);
    try {
      await servicioInternetService.activarServicio(selectedServicio.id, formActivar);
      setServicios(prev => prev.map(s => s.id === selectedServicio.id ? {
        ...s,
        estado_servicio: 'ACTIVO',
        ip_asignada: formActivar.ip_asignada,
        mac_router: formActivar.mac_router,
      } : s));
      setShowActivarModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    servicios,
    loading,
    showModal,
    setShowModal,
    showActivarModal,
    setShowActivarModal,
    selectedServicio,
    setSelectedServicio,
    formServicio,
    setFormServicio,
    formActivar,
    setFormActivar,
    handleCrear,
    handleActivar,
    reload: loadServicios,
  };
}
