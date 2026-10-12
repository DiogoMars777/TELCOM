import { useState } from 'react';
import { pagoMensualidadService } from '../../models/CU10_GestionarPagoMensualidad/pagoMensualidadModel';
import { mockMensualidades } from '../../models/CU09_GenerarMensualidades/mensualidadModel';

export function usePagoMensualidadController() {
  const [selectedFactura, setSelectedFactura] = useState(mockMensualidades[0]);
  const [metodoPago, setMetodoPago] = useState('QR');
  const [nroTransaccion, setNroTransaccion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [reciboGenerado, setReciboGenerado] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        mensualidad_id: selectedFactura.id,
        monto_pagado: selectedFactura.monto,
        metodo_pago: metodoPago,
        numero_transaccion: nroTransaccion,
        observaciones,
      };
      const res = await pagoMensualidadService.registrarPago(payload);
      setReciboGenerado({
        codigo_recibo: res?.data?.pago?.codigo_recibo || 'REC-202610-891',
        monto: selectedFactura.monto,
        metodo: metodoPago,
        fecha: new Date().toLocaleString(),
        factura: selectedFactura.codigo_factura,
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedFactura,
    setSelectedFactura,
    metodoPago,
    setMetodoPago,
    nroTransaccion,
    setNroTransaccion,
    observaciones,
    setObservaciones,
    loading,
    reciboGenerado,
    setReciboGenerado,
    handleSubmit,
  };
}
