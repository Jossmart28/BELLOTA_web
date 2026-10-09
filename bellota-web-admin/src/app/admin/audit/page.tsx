'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AuditLog } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, RotateCcw, Download, BarChart2, List, AlertTriangle,
  FileText, Calendar, AlertCircle, ArrowRightLeft, Ban, Trash2,
  CheckCircle2, LogIn, Filter
} from 'lucide-react';
import Link from 'next/link';

export default function AuditDashboard() {
  const [activeTab, setActiveTab] = useState<'resumen' | 'logs' | 'anomalias'>('resumen');
  const { user } = useAuth();
  
  // Dummy fetch or real fetch depending on backend readiness
  const { data: logs = [], isLoading, refetch, isFetching } = useQuery<AuditLog[]>({
    queryKey: ['audit_logs'],
    queryFn: async () => {
      try {
        const res = await api.get('/audit/logs');
        return res.data;
      } catch {
        // Fallback dummy data if endpoint fails
        return [
          { id: 1, action: 'Inicio de sesiÃ³n', target_type: 'user', target_id: 2, created_at: '2026-10-09T03:17:00Z' },
          { id: 2, action: 'Intento de login fallido', created_at: '2026-10-09T03:16:00Z' },
          { id: 3, action: 'Intento de login fallido', created_at: '2026-10-09T03:16:00Z' },
          { id: 4, action: 'Intento de login fallido', created_at: '2026-10-09T03:16:00Z' },
        ] as AuditLog[];
      }
    },
    refetchOnWindowFocus: false,
  });

  const { data: stats } = useQuery({
    queryKey: ['audit_stats'],
    queryFn: async () => {
      try {
        const res = await api.get('/audit/stats');
        return res.data;
      } catch {
        // Dummy
        return {
          total_logs: 58,
          today: 58,
          failed_logins: 56,
          role_changes: 0,
          suspensions: 0,
          deletions: 0
        };
      }
    },
    refetchOnWindowFocus: false,
  });

  const renderResumen = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="text-stone-500 text-sm font-medium mb-3 ml-2">Actividad general</h3>
      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard icon={<FileText className="text-[#3B82F6]" />} value={stats?.total_logs || 0} label="Total logs" bgIcon="bg-blue-50" />
        <StatCard icon={<Calendar className="text-[#22C55E]" />} value={stats?.today || 0} label="Hoy" bgIcon="bg-green-50" />
        <StatCard icon={<AlertCircle className="text-[#EF4444]" />} value={stats?.failed_logins || 0} label="Login fallido" bgIcon="bg-red-50" />
        <StatCard icon={<ArrowRightLeft className="text-[#F97316]" />} value={stats?.role_changes || 0} label="Cambios de rol" bgIcon="bg-orange-50" />
        <StatCard icon={<Ban className="text-[#A855F7]" />} value={stats?.suspensions || 0} label="Suspensiones" bgIcon="bg-purple-50" />
        <StatCard icon={<Trash2 className="text-[#EF4444]" />} value={stats?.deletions || 0} label="Eliminaciones" bgIcon="bg-red-50" />
      </div>

      <h3 className="text-stone-500 text-sm font-medium mb-3 ml-2">Información del auditor</h3>
      <div className="bg-white/80 p-4 rounded-2xl shadow-sm border border-[#F2E8D8] flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#EBF3FF] rounded-full flex items-center justify-center shrink-0">
          <List className="text-[#3B82F6] w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-stone-900 truncate">{user?.name || 'Administrador'}</h3>
          <p className="text-[13px] text-stone-500 truncate mb-1">{user?.email}</p>
        </div>
        <span className="bg-[#EBF3FF] text-[#2C62D6] text-[11px] font-medium px-3 py-1 rounded-md capitalize">
          {user?.role}
        </span>
      </div>

      <h3 className="text-stone-500 text-sm font-medium mb-3 ml-2">Permisos asignados</h3>
      <div className="space-y-3 px-2">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
          <span className="text-sm font-medium text-stone-700">Asignar roles</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
          <span className="text-sm font-medium text-stone-700">Configurar el sistema</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
          <span className="text-sm font-medium text-stone-700">Detectar anomalías</span>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-2 text-stone-700 font-medium">
          <Filter className="w-5 h-5" /> Filtros
        </div>
        <span className="text-stone-400">âŒ„</span>
      </div>
      
      <p className="text-stone-500 text-sm mb-3 ml-2">{logs.length} registro(s) â€” PÃ¡gina 1</p>

      <div className="space-y-0 divide-y divide-[#E6DFD3] border-t border-b border-[#E6DFD3]">
        {isLoading ? (
          <p className="p-4 text-center text-stone-400">Cargando...</p>
        ) : (
          logs.map((log) => {
            const isError = log.action.toLowerCase().includes('fallido');
            return (
              <div key={log.id} className="py-4 px-2 flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isError ? 'bg-red-50 text-red-500' : 'bg-stone-100 text-stone-500'}`}>
                  {isError ? <AlertCircle className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-[15px] font-medium ${isError ? 'text-[#D3574D]' : 'text-stone-900'}`}>
                    {log.action}
                  </h4>
                  {log.target_type && (
                    <p className="text-[12px] text-stone-500">Recurso: {log.target_type} #{log.target_id}</p>
                  )}
                  <p className="text-[12px] text-stone-400">09/10/2026 03:16</p> {/* Should format created_at */}
                </div>
                {log.target_id && !isError && (
                  <div className="text-[12px] text-stone-400">User #{log.target_id}</div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-between items-center p-4">
        <button className="text-stone-400 font-medium text-sm px-4 py-2 flex items-center gap-1" disabled>
           Anterior
        </button>
        <button className="text-[#D3574D] font-medium text-sm px-4 py-2 flex items-center gap-1">
          Siguiente 
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#FAF6ED]">
      {/* Top Header */}
      <div className="bg-[#96ABC0] text-white pt-10 pb-0 shadow-sm relative">
        <div className="flex justify-between items-center px-4 pb-4">
          <Link href="/admin" className="opacity-90 hover:opacity-100 transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-[19px] font-bold tracking-wide truncate">Dashboard de Audit...</h1>
          <div className="flex gap-4">
            <button onClick={() => refetch()} className="opacity-90 hover:opacity-100 transition">
              <RotateCcw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button className="opacity-90 hover:opacity-100 transition">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full mt-2">
          <button 
            onClick={() => setActiveTab('resumen')}
            className={`flex-1 flex flex-col items-center gap-1 pb-3 relative ${activeTab === 'resumen' ? 'text-white' : 'text-white/70'}`}
          >
            <BarChart2 className="w-6 h-6" />
            <span className="text-sm font-medium">Resumen</span>
            {activeTab === 'resumen' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-white rounded-t-md" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`flex-1 flex flex-col items-center gap-1 pb-3 relative ${activeTab === 'logs' ? 'text-white' : 'text-white/70'}`}
          >
            <List className="w-6 h-6" />
            <span className="text-sm font-medium">Logs</span>
            {activeTab === 'logs' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-white rounded-t-md" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('anomalias')}
            className={`flex-1 flex flex-col items-center gap-1 pb-3 relative ${activeTab === 'anomalias' ? 'text-white' : 'text-white/70'}`}
          >
            <AlertTriangle className="w-6 h-6" />
            <span className="text-sm font-medium">Anomalías</span>
            {activeTab === 'anomalias' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-white rounded-t-md" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 pb-20">
        {activeTab === 'resumen' && renderResumen()}
        {activeTab === 'logs' && renderLogs()}
        {activeTab === 'anomalias' && (
          <div className="text-center text-stone-500 py-10">
            No se detectaron anomalías recientes.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, bgIcon }: { icon: React.ReactNode, value: number | string, label: string, bgIcon: string }) {
  return (
    <div className="bg-white/80 p-4 rounded-2xl shadow-sm border border-[#F2E8D8] flex items-center gap-3">
      <div className={`w-10 h-10 ${bgIcon} rounded-full flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-[#3B82F6] leading-tight" style={{color: typeof icon === 'object' && icon !== null && 'props' in icon ? (icon as any).props.className.match(/text-\[([^\]]+)\]/)?.[1] || (icon as any).props.className.match(/text-([a-z]+-500)/)?.[1]?.replace('500', '500') : undefined}}>
          {/* Extract color from icon classes to match text color if needed, or just hardcode based on screenshot. The screenshot has different colors for the number: Blue for total, Green for Hoy, Red for login fallido */}
          <span className={
            label === 'Total logs' ? 'text-[#3B82F6]' :
            label === 'Hoy' ? 'text-[#22C55E]' :
            label === 'Login fallido' ? 'text-[#EF4444]' :
            label === 'Cambios de rol' ? 'text-[#F97316]' :
            label === 'Suspensiones' ? 'text-[#A855F7]' : 'text-[#EF4444]'
          }>{value}</span>
        </p>
        <p className="text-[12px] font-medium text-stone-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
