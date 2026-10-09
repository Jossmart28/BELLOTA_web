'use client';
import { RoleGuard, useAuth } from '@/context/AuthContext';
import { Users, LogOut, ShieldAlert, Leaf } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Usuarios', href: '/admin', icon: Users, roles: ['admin'] },
    { name: 'Auditoría', href: '/admin/audit', icon: ShieldAlert, roles: ['admin', 'auditor'] },
  ];

  return (
    <RoleGuard allowedRoles={['admin', 'auditor']}>
      <div className="min-h-screen bg-stone-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-amber-800 text-stone-100 flex flex-col shadow-xl">
          <div className="p-6 flex items-center gap-3 border-b border-amber-700/50">
            <Leaf className="text-amber-500 w-8 h-8" />
            <div>
              <h1 className="font-bold text-lg tracking-tight">Bellota Web</h1>
              <span className="text-xs text-amber-200 capitalize px-2 py-0.5 bg-amber-900 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.filter(item => item.roles.includes(user?.role || '')).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-amber-500 text-white font-medium shadow-md' 
                      : 'text-amber-100 hover:bg-amber-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-amber-700/50">
            <div className="mb-4 px-2">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-amber-300 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-900 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
