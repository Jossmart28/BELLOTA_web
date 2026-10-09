'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';
import { Search, LogOut, Users, Settings, RotateCcw, ShieldCheck, CheckCircle2, XCircle, SearchSlash, Power, UserCog } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'sistema'>('usuarios');
  const [search, setSearch] = useState('');
  const { user: currentUser, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, refetch, isFetching } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    },
    // Prevent refetch on window focus to avoid annoying loading states in mobile
    refetchOnWindowFocus: false,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      await api.put(`/admin/users/${id}/role`, { role });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      await api.put(`/admin/users/${id}/status`, { is_active });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    auditores: users.filter(u => u.role === 'auditor').length,
    estandar: users.filter(u => u.role === 'usuario').length,
    suspendidas: users.filter(u => !u.is_active).length,
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#FAF6ED]">
      {/* Top Header */}
      <div className="bg-[#D3574D] text-white pt-10 pb-0 shadow-sm relative">
        <div className="flex justify-between items-center px-4 pb-4">
          <div className="w-8"></div> {/* Spacer */}
          <h1 className="text-xl font-bold tracking-wide">Panel de Administrador</h1>
          <div className="flex gap-4">
            <button onClick={() => refetch()} className="opacity-90 hover:opacity-100 transition">
              <RotateCcw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={logout} className="opacity-90 hover:opacity-100 transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full mt-2">
          <button 
            onClick={() => setActiveTab('usuarios')}
            className={`flex-1 flex flex-col items-center gap-1 pb-3 relative ${activeTab === 'usuarios' ? 'text-white' : 'text-white/70'}`}
          >
            <Users className="w-6 h-6" />
            <span className="text-sm font-medium">Usuarios</span>
            {activeTab === 'usuarios' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-white rounded-t-md" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('sistema')}
            className={`flex-1 flex flex-col items-center gap-1 pb-3 relative ${activeTab === 'sistema' ? 'text-white' : 'text-white/70'}`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-sm font-medium">Sistema</span>
            {activeTab === 'sistema' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-white rounded-t-md" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {activeTab === 'usuarios' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300" />
              <input 
                type="text"
                placeholder="Buscar por nombre, correo o rol..."
                className="w-full pl-11 pr-4 py-3 bg-[#F5EDE1] border-none rounded-full text-sm focus:ring-2 focus:ring-[#D3574D] outline-none text-stone-700 placeholder:text-stone-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <p className="text-stone-500 text-sm mb-3 ml-2">{filteredUsers.length} usuario(s)</p>

            {/* Users List */}
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-center text-stone-400 py-10">Cargando...</p>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center text-stone-400 py-10 flex flex-col items-center gap-2">
                  <SearchSlash className="w-8 h-8 opacity-20" />
                  <p>No se encontraron resultados.</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="bg-white/80 p-4 rounded-2xl shadow-sm border border-[#F2E8D8] flex items-center gap-4 relative">
                    {/* Avatar Mock */}
                    <div className="w-12 h-12 bg-[#FDE8E6] rounded-full flex items-center justify-center shrink-0">
                      <ShieldCheck className="text-[#D3574D] w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-stone-900 truncate">{user.name}</h3>
                        {currentUser?.id === user.id && (
                          <span className="bg-[#EBF3FF] text-[#2C62D6] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Tú
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-stone-500 truncate mb-2">{user.email}</p>
                      
                      <div className="flex flex-wrap gap-2 items-center mt-1">
                        <select
                          className="bg-[#FDE8E6] text-[#D3574D] text-[11px] font-medium px-2 py-1 rounded-md capitalize border-none outline-none cursor-pointer appearance-none"
                          value={user.role}
                          onChange={(e) => updateRoleMutation.mutate({ id: user.id, role: e.target.value })}
                          disabled={updateRoleMutation.isPending || currentUser?.id === user.id}
                        >
                          <option value="usuario">Usuario</option>
                          <option value="auditor">Auditor</option>
                          <option value="admin">Admin</option>
                        </select>
                        
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: user.id, is_active: !user.is_active })}
                          disabled={updateStatusMutation.isPending || currentUser?.id === user.id}
                          className={`text-[11px] font-medium px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                            user.is_active 
                              ? "bg-[#EBF7EE] text-[#25823D] hover:bg-[#c9ebd1]" 
                              : "bg-[#FDE8E6] text-[#D3574D] hover:bg-[#fad1cd]"
                          }`}
                        >
                          {user.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {user.is_active ? 'Activo' : 'Suspendido'}
                        </button>
                        
                        <span className="bg-stone-100 text-stone-500 text-[11px] font-medium px-2 py-1 rounded-md uppercase cursor-default">
                          {user.language_pref || 'ES'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* System Info */}
            <h3 className="text-stone-500 text-sm font-medium mb-3 ml-2">Información del sistema</h3>
            
            <div className="bg-transparent space-y-4 mb-8">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 text-stone-700">
                  <Users className="w-5 h-5 opacity-60" />
                  <span className="text-sm font-medium">Total de usuarios</span>
                </div>
                <span className="font-semibold text-stone-800">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 text-stone-700">
                  <ShieldCheck className="w-5 h-5 opacity-60" />
                  <span className="text-sm font-medium">Admins</span>
                </div>
                <span className="font-semibold text-stone-800">{stats.admins}</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 text-stone-700">
                  <Search className="w-5 h-5 opacity-60" />
                  <span className="text-sm font-medium">Auditores</span>
                </div>
                <span className="font-semibold text-stone-800">{stats.auditores}</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 text-stone-700">
                  <Users className="w-5 h-5 opacity-60" />
                  <span className="text-sm font-medium">Usuarios estándar</span>
                </div>
                <span className="font-semibold text-stone-800">{stats.estandar}</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 text-stone-700">
                  <XCircle className="w-5 h-5 opacity-60" />
                  <span className="text-sm font-medium">Cuentas suspendidas</span>
                </div>
                <span className="font-semibold text-stone-800">{stats.suspendidas}</span>
              </div>
            </div>

            <h3 className="text-stone-500 text-sm font-medium mb-3 ml-2 border-t border-stone-200/60 pt-6">Herramientas</h3>
            <div className="space-y-2">
              <Link href="/admin/audit" className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 transition">
                <div className="flex items-start gap-4">
                  <Search className="w-6 h-6 text-[#9A5C9A] mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-stone-800">Ver logs de auditoría</p>
                    <p className="text-[13px] text-stone-500">Historial completo de acciones del sistema</p>
                  </div>
                </div>
                <div className="text-stone-400">›</div>
              </Link>

              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 transition cursor-pointer">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-[#2C62D6] mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-stone-800">Mi cuenta</p>
                    <p className="text-[13px] text-stone-500 capitalize">Rol: {currentUser?.role}</p>
                  </div>
                </div>
                <div className="text-stone-400">›</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
