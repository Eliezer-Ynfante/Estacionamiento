import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { RegisterSchema } from '@schema/authSchemas';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { getErrorMessage } from './authUtils';

export default function RegisterView() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [registerData, setRegisterData] = useState({
    nombre: '',
    correo_electronico: '',
    contraseña: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const validatedData = RegisterSchema.parse(registerData);
      await register(validatedData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black px-4 font-['Montserrat']">
      <style>{`
        .fade-slide {
          animation: fadeSlide .4s ease-out;
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Crear cuenta</h2>
          <p className="text-sm text-gray-400">Regístrate para comenzar</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 fade-slide">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Nombre</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                name="nombre"
                value={registerData.nombre}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-10 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                name="correo_electronico"
                value={registerData.correo_electronico}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-10 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="contraseña"
                value={registerData.contraseña}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-10 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Min. 8 caracteres, una mayúscula, un número y un carácter especial
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">Confirmar contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-10 py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-600 py-3 font-semibold text-white shadow-lg hover:brightness-110 transition disabled:opacity-60"
          >
            {isLoading ? 'Procesando...' : (
              <span className="flex items-center justify-center gap-2">
                Crear cuenta <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="font-semibold text-orange-500 hover:text-orange-400 transition">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}
