import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../config/axios';

export function useProfileVisit(handle: string) {
  const { mutate: recordVisit } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('AUTH_TOKEN');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await api.post(`/profile/${handle}/visit`, {
        referrer: document.referrer || null
      }, { headers });
    },
    // No necesitamos onSuccess/onError porque esto se ejecuta silenciosamente
  });

  useEffect(() => {
    // Registrar la visita cuando se carga el componente
    recordVisit();

    // También podríamos usar un timeout para registrar solo si el usuario
    // permanece un tiempo mínimo en la página
  }, [handle, recordVisit]);

  return null; // Este hook no necesita devolver nada
}
