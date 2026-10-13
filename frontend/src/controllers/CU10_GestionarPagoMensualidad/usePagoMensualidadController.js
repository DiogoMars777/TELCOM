import { useState, useEffect } from 'react';
import { pagoMensualidadService } from '../../models/CU10_GestionarPagoMensualidad/pagoMensualidadModel';
import { mensualidadService } from '../../models/CU09_GenerarMensualidades/mensualidadModel';
import { describeApiError } from '../../services/apiClient';

function periodoActual() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function usePagoMensualidadController() {
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [metodoPago, setMetodoPago] = useState('QR');
  const [nroTransaccion, setNroTransaccion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reciboGenerado, setReciboGenerado] = useState(null);

  // Las facturas a cobrar provienen del backend (CU09), no de datos inventados.
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await mensualidadService.fetchMensualidades(periodoActual());
        const pendientes = data.filter((m) => m.estado_pago !== 'PAGADO');
        if (!active) return;
        setFacturas(pendientes);
        setSelectedFactura(pendientes[0] ?? null);
      } catch (e) {
        if (!active) return;
        setFacturas([]);
        setSelectedFactura(null);
        setError(describeApiError(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFactura) {
      setError('No hay una factura pendiente seleccionada.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        mensualidad_id: selectedFactura.id,
        monto_pagado: selectedFactura.monto,
        metodo_pago: metodoPago,
        numero_transaccion: nroTransaccion,
        observaciones,
      };
      const res = await pagoMensualidadService.registrarPago(payload);
      const pago = res?.data?.pago;
      if (!pago) {
        throw new Error('El servidor no confirmó el registro del pago.');
      }
      // El recibo se construye con los datos REALES devueltos por el backend.
      setReciboGenerado({
        codigo_recibo: pago.codigo_recibo,
        monto: pago.monto_pagado ?? selectedFactura.monto,
        metodo: pago.metodo_pago ?? metodoPago,
        fecha: new Date().toLocaleString(),
        factura: selectedFactura.codigo_factura,
      });
      setNroTransaccion('');
      setObservaciones('');
    } catch (err) {
      setError(describeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    facturas,
    selectedFactura,
    setSelectedFactura,
    metodoPago,
    setMetodoPago,
    nroTransaccion,
    setNroTransaccion,
    observaciones,
    setObservaciones,
    loading,
    error,
    reciboGenerado,
    setReciboGenerado,
    handleSubmit,
  };
}
