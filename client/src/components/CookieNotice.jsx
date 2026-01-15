import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const cookieAccepted = sessionStorage.getItem('cookiesAccepted');
    if (!cookieAccepted) {
      const timer = setTimeout(() => setShowNotice(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem('cookiesAccepted', 'true');
    setShowNotice(false);
  };

  const handleClose = () => {
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full bg-white rounded-t-2xl shadow-2xl animate-slide-up">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header compacto */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900">🍪 Política de Cookies</h3>
            <button 
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded transition"
              aria-label="Cerrar"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Contenido minimalista */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Utilizamos cookies para garantizar el correcto funcionamiento del sitio y mejorar tu experiencia.{' '}
            <a href="/politica-privacidad" className="text-orange-600 font-medium hover:underline">
              Más información
            </a>
          </p>

          {/* Acciones */}
          <div className="flex gap-3">
            <button 
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Solo Esenciales
            </button>
            <button 
              onClick={handleAccept}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition"
            >
              Aceptar Todas
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease;
        }
      `}</style>
    </div>
  );
}