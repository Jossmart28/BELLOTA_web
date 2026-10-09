'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import api from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Obtener usuario desde API
          const { data } = await api.get('/auth/me');
          setUser(data);
          setToken(storedToken);
        } catch {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [pathname]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    router.push('/admin');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};

// --- RoleGuard Componente para proteger rutas ---
interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (!allowedRoles.includes(user.role)) {
        // Redirigir si no tiene permiso
        router.push('/login'); 
      }
    }
  }, [user, isLoading, allowedRoles, router, pathname]);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center text-amber-800">Cargando perfil...</div>;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return null; 
  }

  return <>{children}</>;
};
