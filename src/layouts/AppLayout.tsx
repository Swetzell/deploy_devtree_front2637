import { Outlet, Link } from "react-router-dom";
import { Toaster } from 'sonner';

export default function AppLayout() {
  return (
    <>
      <div className="bg-slate-800 min-h-screen">
        <header className="bg-white py-4 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-5">
            <img src="/logo.svg" alt="Logotipo Devtree" className="h-10" />

            <nav className="flex space-x-4">
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded">
                Dashboard
              </Link>
              <Link to="/settings" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded">
                Ajustes
              </Link>
              <button
                className="bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100"
                onClick={() => {
                  localStorage.removeItem('AUTH_TOKEN');
                  window.location.href = '/auth/login';
                }}
              >
                Cerrar sesión
              </button>
            </nav>
          </div>
        </header>

        <main className="py-6 px-5">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
