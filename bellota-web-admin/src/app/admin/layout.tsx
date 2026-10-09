'use client';
import { RoleGuard } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin', 'auditor']}>
      <div className="min-h-screen bg-[#FAF6ED] text-stone-900 font-sans pb-10">
        {children}
      </div>
    </RoleGuard>
  );
}
