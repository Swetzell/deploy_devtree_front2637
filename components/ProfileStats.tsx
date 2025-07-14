import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../src/config/axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Period = 'day' | 'week' | 'month' | 'all';

interface ProfileStatsProps {
  handle: string;
}

export default function ProfileStats({ handle }: ProfileStatsProps) {
  const [period, setPeriod] = useState<Period>('week');

  const { data, isLoading, error } = useQuery({
    queryKey: ['profileStats', handle, period],
    queryFn: async () => {
      const response = await api.get(`/profile/${handle}/stats?period=${period}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('AUTH_TOKEN')}`
        }
      });
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="w-10 h-10 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-4">
        No se pudieron cargar las estadísticas
      </div>
    );
  }

  // Definir el tipo para los elementos de dailyStats
  interface DailyStat {
    date: string;
    visits: number;
  }

  // Preparar datos para el gráfico
  const chartData = {
    labels: data?.dailyStats?.map((stat: DailyStat) =>
      new Date(stat.date).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      })
    ) || [],
    datasets: [
      {
        label: 'Visitas',
        data: data?.dailyStats?.map((stat: DailyStat) => stat.visits) || [],
        backgroundColor: 'rgba(6, 182, 212, 0.6)', // cyan-400 con opacidad
        borderColor: 'rgb(6, 182, 212)', // cyan-400
        borderWidth: 1,
      }
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-700">Estadísticas de visitas</h3>

        <div className="flex space-x-2">
          {(['day', 'week', 'month', 'all'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded text-sm ${period === p
                ? 'bg-cyan-400 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {p === 'day' && 'Día'}
              {p === 'week' && 'Semana'}
              {p === 'month' && 'Mes'}
              {p === 'all' && 'Todo'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-slate-800">{data?.totalVisits || 0}</div>
          <div className="text-sm text-slate-500">visitas totales</div>
        </div>

        <div className="h-64">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Visitas por día',
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
