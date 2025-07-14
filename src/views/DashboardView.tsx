import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../config/axios';
import ProfileStats from '../components/ProfileStats';

export default function DashboardView() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) {
      toast.error('Debes iniciar sesión para acceder al dashboard');
      navigate('/auth/login');
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  // Obtener los datos del perfil
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['own-profile'],
    queryFn: async () => {
      const token = localStorage.getItem('AUTH_TOKEN');
      const { data } = await api.get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    },
    enabled: !isLoading, // Solo ejecutar si el usuario está autenticado
  });

  if (isLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">Bienvenido de nuevo, {profile?.name}</p>
          </div>
          <Link
            to={`/profile/${profile?.handle}`}
            className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-lg hover:bg-cyan-200 transition-colors"
          >
            Ver mi perfil público
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de información del perfil */}
          <div className="bg-slate-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Mi Perfil</h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-slate-500">Nombre:</span>
                <span className="font-medium">{profile?.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Handle:</span>
                <span className="font-medium">@{profile?.handle}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium">{profile?.email}</span>
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/settings"
                className="w-full block text-center bg-slate-200 text-slate-700 py-2 rounded hover:bg-slate-300 transition-colors"
              >
                Editar perfil
              </Link>
            </div>
          </div>

          {/* Tarjetas para accesos rápidos */}
          <div className="bg-slate-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Enlaces Rápidos</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/links/add"
                className="bg-cyan-400 text-white p-4 rounded-lg text-center hover:bg-cyan-500 transition-colors"
              >
                Añadir Enlace
              </Link>
              <Link
                to="/links/manage"
                className="bg-slate-200 text-slate-700 p-4 rounded-lg text-center hover:bg-slate-300 transition-colors"
              >
                Gestionar Enlaces
              </Link>
              <Link
                to="/settings/theme"
                className="bg-slate-200 text-slate-700 p-4 rounded-lg text-center hover:bg-slate-300 transition-colors"
              >
                Personalizar Tema
              </Link>
              <Link
                to="/settings/account"
                className="bg-slate-200 text-slate-700 p-4 rounded-lg text-center hover:bg-slate-300 transition-colors"
              >
                Configurar Cuenta
              </Link>
            </div>
          </div>

          {/* Tarjeta para resumen de estadísticas */}
          <div className="bg-slate-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Resumen</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total de enlaces:</span>
                <span className="font-bold text-xl">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Visitas hoy:</span>
                <span className="font-bold text-xl">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Visitas este mes:</span>
                <span className="font-bold text-xl">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Días activo:</span>
                <span className="font-bold text-xl">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas completas */}
        <div className="bg-slate-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-slate-700 mb-6">Estadísticas de Visitas</h2>
          {profile?.handle && <ProfileStats handle={profile.handle} />}
        </div>
      </div>
    </div>
  );
}
