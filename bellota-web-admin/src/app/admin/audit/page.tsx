'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AuditLog } from '@/types';
import { Download, Calendar, Filter, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditDashboard() {
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const res = await api.get('/audit/logs');
      return res.data;
    }
  });

  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID,Usuario ID,Acción,Recurso,Recurso ID,IP,Fecha'];
    const rows = logs.map(l => 
      `${l.id},${l.user_id || ''},${l.action},${l.target_type || ''},${l.target_id || ''},${l.ip_address || ''},${l.created_at}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `auditoria_bellota_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter(l => {
    let match = true;
    if (actionFilter && !l.action.toLowerCase().includes(actionFilter.toLowerCase())) match = false;
    if (dateFilter && !l.created_at.startsWith(dateFilter)) match = false;
    return match;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Registros de Auditoría</h1>
          <p className="text-stone-500">Historial inmutable de acciones en el sistema</p>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50/50 flex gap-4">
          <div className="relative w-64">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input 
              type="text"
              placeholder="Filtrar por acción..."
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            />
          </div>
          <div className="relative w-48">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input 
              type="date"
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none text-stone-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                <th className="p-4 font-medium w-16">ID</th>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Usuario (ID)</th>
                <th className="p-4 font-medium">Acción</th>
                <th className="p-4 font-medium">Recurso</th>
                <th className="p-4 font-medium">Dirección IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-stone-500">Cargando registros...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-stone-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    No se encontraron registros de auditoría
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50 transition-colors text-sm text-stone-700">
                    <td className="p-4 text-stone-500">#{log.id}</td>
                    <td className="p-4">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="p-4 font-medium">{log.user_id ? `Usuario #${log.user_id}` : 'Sistema'}</td>
                    <td className="p-4">
                      <span className="bg-stone-100 px-2 py-1 rounded text-stone-800 font-mono text-xs">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4">{log.target_type || '-'} {log.target_id ? `(#${log.target_id})` : ''}</td>
                    <td className="p-4 font-mono text-xs text-stone-500">{log.ip_address || '0.0.0.0'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
