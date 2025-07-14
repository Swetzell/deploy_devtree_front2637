import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import type { RegisterForm } from '../types';
import ErrorMessage from '../../components/ErrorMessage';
import api from '../config/axios';
export default function RegisterView() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: RegisterForm = {
    name: "",
    email: '',
    handle: '',
    password: '',
    password_confirmation: '',
  }

  const { register, watch, reset, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues,
    mode: 'onBlur'
  });

  const password = watch('password');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async (formData: RegisterForm) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      toast.success('Cuenta creada exitosamente');
      reset();

      // Redireccionar al login después de un registro exitoso
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response?.data.error || 'Error al registrar tu cuenta');
      } else {
        toast.error('Ocurrió un error al conectar con el servidor');
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <h1 className='text-center text-3xl md:text-4xl text-white font-bold'>Crea tu cuenta</h1>
      <p className='text-center text-slate-300 mt-2'>Únete a DevTree y crea tu página de enlaces personalizada</p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="bg-white px-6 py-10 rounded-lg shadow-xl mt-8 max-w-xl mx-auto"
      >
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="text-lg text-slate-600 font-medium block mb-2">Nombre</label>
            <div className="relative group">
              <span className="absolute left-3 top-3 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                id="name"
                type='text'
                placeholder='Tu nombre completo'
                autoComplete="name"
                className='bg-slate-100 border border-slate-200 p-3 pl-12 rounded-lg w-full placeholder-slate-400 
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition
                  hover:bg-slate-50'
                {...register('name', {
                  required: "El nombre es obligatorio",
                  minLength: { value: 3, message: "Debe tener al menos 3 caracteres" }
                })}
              />
            </div>
            {errors.name && (
              <ErrorMessage>
                {errors.name.message}
              </ErrorMessage>
            )}
          </div>

          {/* Email */}
          <div>
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

          {/* Handle/Username */}
          <div className='col-span-1 md:col-span-2'>
            <label htmlFor='handle' className='text-lg text-slate-600 font-medium block mb-2'>Nombre de usuario</label>
            <div className="relative group">
              <span className="absolute left-3 top-3 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </span>
              <input
                id='handle'
                type='text'
                placeholder='username (sin espacios)'
                autoComplete="username"
                className='bg-slate-100 border border-slate-200 p-3 pl-12 rounded-lg w-full placeholder-slate-400 
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition
                  hover:bg-slate-50'
                {...register('handle', {
                  required: "El nombre de usuario es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: "Solo letras, números, guiones y guiones bajos"
                  },
                  minLength: {
                    value: 3,
                    message: "Debe tener al menos 3 caracteres"
                  },
                  maxLength: {
                    value: 30,
                    message: "No debe exceder los 30 caracteres"
                  }
                })}
              />
            </div>
            <div className="flex items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-slate-500">Este será tu URL personalizado: <span className="text-cyan-600 font-medium">devtree.com/</span><span className="font-medium">tu-username</span></p>
            </div>
            {errors.handle && (
              <ErrorMessage>
                {errors.handle.message}
              </ErrorMessage>
            )}
          </div>

          {/* Password */}
          <div>
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
                autoComplete="new-password"
                className='bg-slate-100 border border-slate-200 p-3 pl-12 pr-12 rounded-lg w-full 
                  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                  focus:border-transparent transition hover:bg-slate-50'
                {...register('password', {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Debe contener mayúsculas, minúsculas, números y al menos un símbolo"
                  }
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
            <div className="flex items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-slate-500">Debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos</p>
            </div>
            {errors.password && (
              <ErrorMessage>
                {errors.password.message}
              </ErrorMessage>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor='password_confirmation' className='text-lg text-slate-600 font-medium block mb-2'>Confirmar contraseña</label>
            <div className="relative group">
              <span className="absolute left-3 top-3 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <input
                id='password_confirmation'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='••••••••'
                autoComplete="new-password"
                className='bg-slate-100 border border-slate-200 p-3 pl-12 pr-12 rounded-lg w-full 
                  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                  focus:border-transparent transition hover:bg-slate-50'
                {...register('password_confirmation', {
                  required: "Confirma tu contraseña",
                  validate: (value) => value === password || "Las contraseñas no coinciden"
                })}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
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
            {errors.password_confirmation && (
              <ErrorMessage>
                {errors.password_confirmation.message}
              </ErrorMessage>
            )}
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
              Creando cuenta...
            </>
          ) : (
            'Crear cuenta'
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/auth/login" className="text-cyan-600 hover:text-cyan-800 font-medium transition underline">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Al registrarte, aceptas nuestros <a href="#" className="text-cyan-600 hover:text-cyan-800">Términos de servicio</a> y <a href="#" className="text-cyan-600 hover:text-cyan-800">Política de privacidad</a>
          </p>
        </div>
      </form>
    </>
  )
}