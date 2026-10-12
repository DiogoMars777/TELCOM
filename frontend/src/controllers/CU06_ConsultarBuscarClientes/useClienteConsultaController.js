import { useState, useEffect } from 'react';
import { clienteConsultaService, mockClientesList } from '../../models/CU06_ConsultarBuscarClientes/clienteConsultaModel';

export function useClienteConsultaController() {
  const [clientes, setClientes] = useState(mockClientesList);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  const loadClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteConsultaService.fetchClientes({
        buscar: busqueda,
        estado: estadoFiltro,
      });
      // Filtrado local si es mockup
      const filtered = data.filter(c => {
        const matchesTerm = !busqueda ||
          c.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
          c.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
          c.documento_identidad.includes(busqueda) ||
          c.codigo_cliente.toLowerCase().includes(busqueda.toLowerCase());
        const matchesEstado = !estadoFiltro || c.estado === estadoFiltro;
        return matchesTerm && matchesEstado;
      });
      setClientes(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, [busqueda, estadoFiltro]);

  return {
    clientes,
    loading,
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    reload: loadClientes,
  };
}
