import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../components/ErrorMessage';
import type { LoginForm } from '../types';
import api from '../config/axios';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
export default function LoginView() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: LoginForm = {
    email: '',
    password: ''
  }

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues,
    mode: 'onBlur'
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (formData: LoginForm) => {
    setIsLoading(true);
    try {
      const { data: token } = await api.post(`/auth/login`, formData)
      localStorage.setItem('AUTH_TOKEN', token)

      // con esto redirigimos al usuario al dashboard
      toast.success('¡Bienvenido! Iniciaste sesión correctamente');
      navigate('/dashboard');
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response?.data.error || 'Error al iniciar sesión')
      } else {
        toast.error('Ocurrió un error al conectar con el servidor')
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <h1 className='text-center text-3xl md:text-4xl text-white font-bold'>Iniciar Sesión</h1>
      <p className='text-center text-slate-300 mt-2'>Bienvenido de nuevo a DevTree</p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-white px-6 py-10 rounded-lg shadow-xl mt-8 max-w-md mx-auto"
        noValidate
      >
        <div className="mb-8">
          {/* Email Field */}
          <div className='mb-6'>
            <label htmlFor='email' className='text-lg text-slate-600 font-medium block mb-2'>Email</label>
            <div className="relative group">
              <span className="absolute left-3 top-3 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id='email'
                type='email'
                placeholder='tu@email.com'
                autoComplete="email"
                className='bg-slate-100 border border-slate-200 p-3 pl-12 rounded-lg w-full placeholder-slate-400 
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition
                  hover:bg-slate-50'
                {...register('email', {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email no válido",
                  },
                })}
              />
            </div>
            {errors.email && (
              <ErrorMessage>
                {errors.email.message}
              </ErrorMessage>
            )}
          </div>

          {/* Password Field */}
          <div className='mb-3'>
            <label htmlFor='password' className='text-lg text-slate-600 font-medium block mb-2'>Contraseña</label>
            <div className="relative group">
              <span className="absolute left-3 top-3 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                autoComplete="current-password"
                className='bg-slate-100 border border-slate-200 p-3 pl-12 pr-12 rounded-lg w-full 
                  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                  focus:border-transparent transition hover:bg-slate-50'
                {...register('password', {
                  required: "La contraseña es obligatoria",
                })}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <ErrorMessage>
                {errors.password.message}
              </ErrorMessage>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link to="/auth/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-800 transition">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isLoading}
          className='bg-cyan-500 hover:bg-cyan-600 transition p-3 text-lg w-full text-white 
            rounded-lg font-medium cursor-pointer shadow-md flex justify-center items-center 
            disabled:bg-cyan-300 disabled:cursor-not-allowed'
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            ¿No tienes una cuenta?{" "}
            <Link to="/auth/register" className="text-cyan-600 hover:text-cyan-800 font-medium transition underline">
              Regístrate
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Al iniciar sesión, aceptas nuestros <a href="#" className="text-cyan-600 hover:text-cyan-800">Términos de servicio</a> y <a href="#" className="text-cyan-600 hover:text-cyan-800">Política de privacidad</a>
          </p>
        </div>
      </form>
    </>
  )
}