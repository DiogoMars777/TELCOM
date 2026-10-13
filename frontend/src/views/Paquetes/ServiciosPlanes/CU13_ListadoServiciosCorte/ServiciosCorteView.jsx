import React from 'react';
import { useServiciosCorteController } from '../../../../controllers/Paquetes/ServiciosPlanes/CU13_ListadoServiciosCorte/useServiciosCorteController';
import { Scissors, AlertCircle, RefreshCw, Send } from 'lucide-react';

export default function ServiciosCorteView({ onIrACorte }) {
  const { servicios, loading, error, reload } = useServiciosCorteController();

  return (
    <div className="view-panel">
      <div className="view-header">
        <div>
          <h2>CU13: Consultar Listado de Servicios para Corte</h2>
          <p className="subtitle">Lotes de abonados con mora vencida listos para suspensión técnica</p>
        </div>
        <button className="btn btn-secondary" onClick={reload} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Actualizar
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} /> No se pudo cargar el listado de servicios para corte: {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Cliente Deudor</th>
              <th>Plan</th>
              <th>IP Asignada</th>
              <th>Días de Mora</th>
              <th>Deuda Pendiente</th>
              <th>Acción Operativa</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <RefreshCw size={16} className="spin" /> Cargando servicios…
                </td>
              </tr>
            )}
            {!loading && servicios.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8' }}>Sin registros</td>
              </tr>
            )}
            {servicios.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.codigo_servicio}</strong></td>
                <td>{s.cliente_nombre}</td>
                <td>{s.plan_nombre}</td>
                <td><code>{s.ip_asignada}</code></td>
                <td><strong className="text-danger">{s.dias_mora ?? '—'} días</strong></td>
                <td><strong className="text-danger">{s.monto_deuda != null ? `Bs. ${s.monto_deuda}` : '—'}</strong></td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onIrACorte && onIrACorte(s)}
                  >
                    <Scissors size={14} /> Proceder a Corte (CU14)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
