import { useState } from 'react';
import { corteRegistroService } from '../../models/CU14_RegistrarCorteRealizado/corteRegistroModel';
import { mockServiciosParaCorte } from '../../models/CU13_ListadoServiciosCorte/servicioCorteModel';

export function useCorteRegistroController(initialServicio = null) {
  const [selectedServicio, setSelectedServicio] = useState(initialServicio || mockServiciosParaCorte[0]);
  const [tipoCorte, setTipoCorte] = useState('LOGICO');
  const [motivo, setMotivo] = useState('Mora prolongada mayor a 15 días');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [corteSuccess, setCorteSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        servicio_id: selectedServicio.id,
        tipo_corte: tipoCorte,
        motivo,
        observaciones,
      };
      const res = await corteRegistroService.registrarCorte(payload);
      setCorteSuccess({
        codigo_orden: res?.data?.corte?.codigo_orden_corte || 'COR-202610-911',
        servicio: selectedServicio.codigo_servicio,
        tipo: tipoCorte,
        fecha: new Date().toLocaleString(),
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedServicio,
    setSelectedServicio,
    tipoCorte,
    setTipoCorte,
    motivo,
    setMotivo,
    observaciones,
    setObservaciones,
    loading,
    corteSuccess,
    setCorteSuccess,
    handleSubmit,
  };
}
