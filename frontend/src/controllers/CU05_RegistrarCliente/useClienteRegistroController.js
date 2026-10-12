import { useState } from 'react';
import { clienteRegistroService, initialCliente } from '../../models/CU05_RegistrarCliente/clienteRegistroModel';

export function useClienteRegistroController(onSuccess) {
  const [cliente, setCliente] = useState(initialCliente);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await clienteRegistroService.registerCliente(cliente);
      setSuccessMsg(`Cliente registrado exitosamente (Código: ${res?.data?.codigo_cliente || 'CLI-NUEVO'})`);
      setCliente(initialCliente);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Error registrando cliente.');
    } finally {
      setLoading(false);
    }
  };

  return {
    cliente,
    loading,
    successMsg,
    errorMsg,
    handleChange,
    handleSubmit,
  };
}
