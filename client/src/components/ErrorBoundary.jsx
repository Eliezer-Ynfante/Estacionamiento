import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import process from 'process';

export function ErrorBoundary({ error, resetError }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.error('Error caught by boundary:', error);
  }, [error]);

  if (!isVisible) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="max-w-lg w-full bg-red-950/30 border border-red-900 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-4">
          <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
          <h1 className="text-2xl font-bold">¡Algo salió mal!</h1>
        </div>

        <p className="text-gray-300 mb-4">
          {error?.message || 'Ocurrió un error inesperado'}
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 bg-black/40 rounded p-3 text-sm text-gray-400">
            <summary className="cursor-pointer hover:text-white">Ver detalles técnicos</summary>
            <pre className="mt-2 overflow-auto text-xs">
              {error?.stack || 'Sin stack trace'}
            </pre>
          </details>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsVisible(false);
              resetError?.();
            }}
            className="flex-1 bg-orange-700 hover:brightness-110 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Reintentar
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-700 hover:brightness-110 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
