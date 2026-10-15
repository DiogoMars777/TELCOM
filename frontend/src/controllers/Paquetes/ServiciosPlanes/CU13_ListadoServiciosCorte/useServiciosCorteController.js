import { useState, useEffect, useCallback } from 'react';
import { serviciosCorteService } from '../../../../models/Paquetes/ServiciosPlanes/CU13_ListadoServiciosCorte/servicioCorteModel';
import { zonaService } from '../../../../models/Paquetes/GestionClientesZonas/CU04_ZonasCobertura/zonaCoberturaModel';
import { describeApiError } from '../../../../services/apiClient';

export function useServiciosCorteController() {
  const [servicios, setServicios] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtros interactivos
  const [diasMora, setDiasMora] = useState(5);
  const [zonaId, setZonaId] = useState('');
  const [buscar, setBuscar] = useState('');

  // Cargar catálogo de zonas para el filtro
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await zonaService.fetchZonas();
        if (active) setZonas(list || []);
      } catch {
        if (active) setZonas([]);
      }
    })();
    return () => { active = false; };
  }, []);

  const loadServicios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviciosCorteService.fetchServiciosCorte({
        dias_mora: diasMora,
        zona_id: zonaId,
        buscar: buscar.trim(),
      });
      setServicios(data);
    } catch (e) {
      setServicios([]);
      setError(describeApiError(e));
    } finally {
      setLoading(false);
    }
  }, [diasMora, zonaId, buscar]);

  useEffect(() => {
    loadServicios();
  }, [loadServicios]);

  // Exportar listado a Excel / CSV con codificación UTF-8 BOM
  const exportarCsv = async () => {
    try {
      // Obtenemos todos los registros que coinciden con los filtros
      const data = await serviciosCorteService.fetchServiciosCorte({
        dias_mora: diasMora,
        zona_id: zonaId,
        buscar: buscar.trim(),
        todos: true,
      });

      if (!data || data.length === 0) {
        alert('No hay registros para exportar con los filtros actuales.');
        return;
      }

      const headers = [
        'Código Servicio',
        'Cliente Deudor',
        'Documento / CI',
        'Teléfono',
        'Zona de Cobertura',
        'Plan Contratado',
        'IP Asignada',
        'Días de Mora',
        'Deuda Total (Bs.)',
      ];

      const rows = data.map((s) => [
        `"${s.codigo_servicio || ''}"`,
        `"${(s.cliente_nombre || '').replace(/"/g, '""')}"`,
        `"${s.cliente_ci || ''}"`,
        `"${s.cliente_telefono || ''}"`,
        `"${s.zona_nombre || ''}"`,
        `"${s.plan_nombre || ''}"`,
        `"${s.ip_asignada || ''}"`,
        s.dias_mora ?? 0,
        s.monto_deuda != null ? Number(s.monto_deuda).toFixed(2) : '0.00',
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fecha = new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `TELCOM_Servicios_Para_Corte_${fecha}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Error al exportar los datos: ' + describeApiError(e));
    }
  };

  const imprimirHojaRuta = () => {
    window.print();
  };

  return {
    servicios,
    zonas,
    loading,
    error,
    reload: loadServicios,
    diasMora,
    setDiasMora,
    zonaId,
    setZonaId,
    buscar,
    setBuscar,
    exportarCsv,
    imprimirHojaRuta,
  };
}
