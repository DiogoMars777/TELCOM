import { useState, useEffect } from 'react';
import { servicioInternetService } from '../../../../models/Paquetes/ServiciosPlanes/CU08_RegistrarActivarServicio/servicioInternetModel';
import { describeApiError } from '../../../../services/apiClient';

export function useServicioInternetController() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);       // Error de carga del listado
  const [formError, setFormError] = useState(null); // Error de contratación/activación
  const [showModal, setShowModal] = useState(false);
  const [showActivarModal, setShowActivarModal] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);

  // Catálogos reales para el formulario (clientes y planes).
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [catalogError, setCatalogError] = useState(null);

  const [formServicio, setFormServicio] = useState({
    cliente_id: '',
    plan_id: '',
    plan_nombre: '',
    velocidad_mbps: '',
    precio_mensual: '',
    direccion_instalacion: '',
    dia_corte: 10,
  });

  const [formActivar, setFormActivar] = useState({
    ip_asignada: '',
    mac_router: '',
  });

  const loadServicios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicioInternetService.fetchServicios();
      setServicios(data);
    } catch (e) {
      setServicios([]);
      setError(describeApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogos = async () => {
    setCatalogError(null);
    try {
      const [clientesData, planesData] = await Promise.all([
        servicioInternetService.fetchClientes(),
        servicioInternetService.fetchPlanes(),
      ]);
      setClientes(clientesData);
      setPlanes(planesData);
    } catch (e) {
      setCatalogError(describeApiError(e));
    }
  };

  useEffect(() => {
    loadServicios();
    loadCatalogos();
  }, []);

  // Al elegir un cliente se guarda su `cliente_id` real y se usa su dirección
  // como valor por defecto editable de la dirección de instalación.
  const handleClienteChange = (value) => {
    const id = value === '' ? '' : Number(value);
    const cliente = clientes.find((c) => c.id === id);
    setFormServicio((prev) => ({
      ...prev,
      cliente_id: id,
      direccion_instalacion: cliente?.direccion ?? '',
    }));
  };

  // Al elegir un plan se autocompletan nombre, velocidad y precio mensual.
  const handlePlanChange = (value) => {
    const id = value === '' ? '' : Number(value);
    const plan = planes.find((p) => p.id === id);
    setFormServicio((prev) => ({
      ...prev,
      plan_id: id,
      plan_nombre: plan?.nombre_plan ?? '',
      velocidad_mbps: plan?.velocidad_mbps ?? '',
      precio_mensual: plan?.precio_mensual ?? '',
    }));
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    try {
      // Solo se envían los campos que acepta el backend (sin `plan_id`).
      await servicioInternetService.registrarServicio({
        cliente_id: formServicio.cliente_id,
        plan_nombre: formServicio.plan_nombre,
        velocidad_mbps: Number(formServicio.velocidad_mbps),
        precio_mensual: Number(formServicio.precio_mensual),
        direccion_instalacion: formServicio.direccion_instalacion,
        dia_corte: Number(formServicio.dia_corte),
      });
      // Solo se cierra el modal cuando el backend confirmó. Se recarga el
      // listado real en lugar de inventar el registro localmente.
      setShowModal(false);
      setFormServicio({
        cliente_id: '',
        plan_id: '',
        plan_nombre: '',
        velocidad_mbps: '',
        precio_mensual: '',
        direccion_instalacion: '',
        dia_corte: 10,
      });
      await loadServicios();
    } catch (err) {
      setFormError(describeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleActivar = async (e) => {
    e.preventDefault();
    if (!selectedServicio) return;
    setLoading(true);
    setFormError(null);
    try {
      await servicioInternetService.activarServicio(selectedServicio.id, formActivar);
      setShowActivarModal(false);
      setFormActivar({ ip_asignada: '', mac_router: '' });
      await loadServicios();
    } catch (err) {
      setFormError(describeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    servicios,
    loading,
    error,
    formError,
    showModal,
    setShowModal,
    showActivarModal,
    setShowActivarModal,
    selectedServicio,
    setSelectedServicio,
    clientes,
    planes,
    catalogError,
    formServicio,
    setFormServicio,
    formActivar,
    setFormActivar,
    handleClienteChange,
    handlePlanChange,
    handleCrear,
    handleActivar,
    reload: loadServicios,
  };
}
