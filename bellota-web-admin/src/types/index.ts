export type UserRole = 'admin' | 'usuario' | 'auditor' | string;

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  language_pref?: 'es' | 'en' | 'mi';
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  target_type?: string;
  target_id?: number;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalAudits: number;
  pendingRoles: number;
}

export const ROLES_CONFIG: Record<string, { label: string, color: string }> = {
  admin: { label: 'Administrador', color: 'bg-red-600 text-white' },
  auditor: { label: 'Auditor', color: 'bg-amber-500 text-white' },
  usuario: { label: 'Usuario App', color: 'bg-stone-200 text-stone-800' }
};
