import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { LoginSchema } from '@schema/authSchemas';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { getErrorMessage } from './authUtils';

export default function LoginView() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [loginData, setLoginData] = useState({
    correo_electronico: '',
    contraseña: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      LoginSchema.parse(loginData);
      await login(loginData.correo_electronico, loginData.contraseña);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-neutral-900 to-black px-4 font-['Montserrat']">
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
          <h2 className="text-2xl font-bold text-white">Bienvenido</h2>
          <p className="text-sm text-gray-400">Accede a tu cuenta</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 fade-slide">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                name="correo_electronico"
                value={loginData.correo_electronico}
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
                value={loginData.contraseña}
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
          </div>

          <button
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-linear-to-r from-orange-500 to-red-600 py-3 font-semibold text-white shadow-lg hover:brightness-110 transition disabled:opacity-60"
          >
            {isLoading ? 'Procesando...' : (
              <span className="flex items-center justify-center gap-2">
                Iniciar sesión <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="font-semibold text-orange-500 hover:text-orange-400 transition">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
