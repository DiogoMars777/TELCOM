import { useState } from 'react';
import { clienteMantenimientoService } from '../../models/CU07_ActualizarBajaCliente/clienteMantenimientoModel';
import { mockClientesList } from '../../models/CU06_ConsultarBuscarClientes/clienteConsultaModel';

export function useClienteMantenimientoController() {
  const [selectedCliente, setSelectedCliente] = useState(mockClientesList[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [bajaMotivo, setBajaMotivo] = useState('');
  const [showBajaModal, setShowBajaModal] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await clienteMantenimientoService.updateCliente(selectedCliente.id, selectedCliente);
      setMessage({ type: 'success', text: 'Datos del cliente actualizados exitosamente en PostgreSQL.' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBajaLogica = async () => {
    if (!bajaMotivo) return alert('Debe ingresar un motivo de baja');
    setLoading(true);
    try {
      await clienteMantenimientoService.bajaLogica(selectedCliente.id, bajaMotivo);
      setSelectedCliente(prev => ({ ...prev, estado: 'INACTIVO' }));
      setShowBajaModal(false);
      setMessage({ type: 'warning', text: 'Cliente dado de baja lógica correctamente (Soft Delete preservado).' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedCliente,
    setSelectedCliente,
    loading,
    message,
    bajaMotivo,
    setBajaMotivo,
    showBajaModal,
    setShowBajaModal,
    handleUpdate,
    handleBajaLogica,
  };
}
