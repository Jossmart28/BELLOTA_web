'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import axios from 'axios';
import { Leaf } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Endpoint según especificación
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      
      // Obtener datos del usuario recién logueado
      const userRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      const userData = userRes.data;
      
      if (userData.role === 'usuario') {
        setError('Acceso denegado. Este panel es exclusivo para administradores y auditores.');
      } else {
        login(access_token, userData);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Credenciales inválidas o error de conexión.');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-amber-800 py-8 px-6 text-center flex flex-col items-center">
          <div className="bg-stone-50 p-3 rounded-full mb-3">
            <Leaf className="w-8 h-8 text-amber-800" />
          </div>
          <h2 className="text-2xl font-bold text-stone-50">Bellota Web Panel</h2>
          <p className="text-amber-200 text-sm mt-1">Gestión administrativa centralizada</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bellota.app"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Ingresar al Sistema'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
