import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginView from './views/loginView'
import RegisterView from './views/registerView'
import ProfileView from './views/ProfileView'
import DashboardView from './views/DashboardView'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
        </Route>

        {/* Rutas de la aplicación */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/profile/:handle" element={<ProfileView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}