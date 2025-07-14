import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../config/axios';
import { toast } from 'sonner';
import ProfileStats from '../../components/ProfileStats';
import { useProfileVisit } from '../hooks/useProfileVisit';
import type { User } from '../types';

export default function ProfileView() {
  const { handle = '' } = useParams<{ handle: string }>();

  // Registrar la visita al perfil
  useProfileVisit(handle);

  // Obtener datos del perfil
  const { data: profile, isLoading, error } = useQuery<User, Error>({
    queryKey: ['profile', handle],
    queryFn: async () => {
      const response = await api.get(`/profile/${handle}`);
      return response.data as User;
    }
  });

  // Mostrar toast en caso de error
  if (error) {
    toast.error('Error al cargar el perfil');
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center">
          No se pudo cargar el perfil o no existe
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Cabecera del perfil */}
        <div className="bg-slate-800 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
          <p className="text-slate-300">@{profile.handle}</p>
        </div>

        {/* Contenido del perfil */}
        <div className="p-6">
          {/* Aquí irían los links del usuario */}
          <div className="space-y-4">
            {/* Enlaces del usuario */}
          </div>
        </div>
      </div>

      {/* Estadísticas del perfil - solo visible para el dueño del perfil */}
      <div className="mt-8">
        <ProfileStats handle={handle} />
      </div>
    </div>
  );
}
