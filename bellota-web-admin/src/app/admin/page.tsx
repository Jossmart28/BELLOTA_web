'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, ROLES_CONFIG, DashboardStats } from '@/types';
import { Search, CheckCircle2, XCircle, Users, Activity, ShieldCheck, Key } from 'lucide-react';
import { RoleGuard } from '@/context/AuthContext';

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  // Fetch Users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    }
  });

  // KPI Mock or Fetch (Depende de si existe el endpoint)
  const stats: DashboardStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    pendingRoles: users.filter(u => u.role === 'usuario').length,
    totalAudits: 1245
  };

  // Mutations
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number, role: string }) => {
      await api.put(`/admin/users/${id}/role`, { role });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: number, is_active: boolean }) => {
      await api.put(`/admin/users/${id}/status`, { is_active });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Gestión de Usuarios</h1>
          <p className="text-stone-500">Administra accesos, roles y estado de las cuentas</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard title="Total Usuarios" value={stats.totalUsers} icon={<Users className="text-amber-500" />} />
          <KpiCard title="Usuarios Activos" value={stats.activeUsers} icon={<Activity className="text-green-500" />} />
          <KpiCard title="Administradores" value={users.filter(u=>u.role==='admin').length} icon={<ShieldCheck className="text-red-500" />} />
          <KpiCard title="Usuarios Regulares" value={stats.pendingRoles} icon={<Key className="text-blue-500" />} />
        </div>

        {/* Tabla / Filtros */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50/50">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input 
                type="text"
                placeholder="Buscar por nombre o correo..."
                className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                  <th className="p-4 font-medium">Usuario</th>
                  <th className="p-4 font-medium">Rol</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {isLoading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-stone-500">Cargando usuarios...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-stone-500">No se encontraron resultados</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-stone-900">{user.name}</div>
                        <div className="text-xs text-stone-500">{user.email}</div>
                      </td>
                      <td className="p-4">
                        <select 
                          className="text-sm border-stone-200 rounded-md bg-stone-50 focus:ring-amber-500 outline-none p-1"
                          value={user.role}
                          onChange={(e) => updateRoleMutation.mutate({ id: user.id, role: e.target.value })}
                          disabled={updateRoleMutation.isPending}
                        >
                          {Object.entries(ROLES_CONFIG).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {user.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {user.is_active ? 'Activo' : 'Suspendido'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => toggleStatusMutation.mutate({ id: user.id, is_active: !user.is_active })}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            user.is_active 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {user.is_active ? 'Suspender' : 'Reactivar'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

function KpiCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
      <div className="p-3 bg-stone-50 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <p className="text-2xl font-bold text-stone-900">{value}</p>
      </div>
    </div>
  );
}
