import React from 'react';
import { usePagoMensualidadController } from '../../../../controllers/Paquetes/FacturacionCobranza/CU10_GestionarPagoMensualidad/usePagoMensualidadController';
import { Receipt, CheckCircle, AlertCircle } from 'lucide-react';

export default function PagoMensualidadView() {
  const {
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
  } = usePagoMensualidadController();

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>Gestionar Pago de Mensualidad</h2>
          <p className="subtitle">Módulo de ventanilla / pasarela para recaudación y emisión de recibos oficiales</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {reciboGenerado ? (
        <div className="receipt-card">
          <div className="receipt-header">
            <CheckCircle size={36} className="text-success" />
            <h3>¡Pago Registrado Exitosamente!</h3>
            <p>Se actualizó el estado de la factura</p>
          </div>
          <div className="receipt-body">
            <div className="receipt-row">
              <span>Nº Recibo Oficial:</span>
              <strong>{reciboGenerado.codigo_recibo}</strong>
            </div>
            <div className="receipt-row">
              <span>Factura Asociada:</span>
              <span>{reciboGenerado.factura}</span>
            </div>
            <div className="receipt-row">
              <span>Monto Cobrado:</span>
              <strong>Bs. {reciboGenerado.monto}</strong>
            </div>
            <div className="receipt-row">
              <span>Método de Pago:</span>
              <span>{reciboGenerado.metodo}</span>
            </div>
            <div className="receipt-row">
              <span>Fecha / Hora:</span>
              <span>{reciboGenerado.fecha}</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setReciboGenerado(null)}>
            Registrar Otro Cobro
          </button>
        </div>
      ) : (
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Seleccionar Factura / Mensualidad Pendiente</label>
                <select
                  value={selectedFactura?.id ?? ''}
                  onChange={(e) => {
                    const f = facturas.find(m => m.id === parseInt(e.target.value));
                    if (f) setSelectedFactura(f);
                  }}
                >
                  {selectedFactura == null && (
                    <option value="">— No hay facturas pendientes —</option>
                  )}
                  {facturas.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.codigo_factura} - {m.cliente_nombre || '—'} - Período: {m.periodo} - Bs. {m.monto} ({m.estado_pago})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Monto a Cobrar</label>
                <input type="text" value={selectedFactura ? `Bs. ${selectedFactura.monto}` : '—'} disabled />
              </div>

              <div className="form-group">
                <label>Método de Pago</label>
                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                  <option value="QR">Pago QR Simple</option>
                  <option value="EFECTIVO">Efectivo (Caja)</option>
                  <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                  <option value="TARJETA">Tarjeta de Débito/Crédito</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nº de Transacción / Comprobante</label>
                <input
                  type="text"
                  placeholder="Ej. TRX-9021894"
                  value={nroTransaccion}
                  onChange={(e) => setNroTransaccion(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <input
                  type="text"
                  placeholder="Sin observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn btn-primary" disabled={loading || !selectedFactura}>
                <Receipt size={18} /> {loading ? 'Procesando Pago...' : 'Confirmar Cobro y Emitir Recibo'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
