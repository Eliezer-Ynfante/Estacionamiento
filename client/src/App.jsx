import React, { useState } from 'react';

function App() {
  const [resultado, setResultado] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckBackend = async () => {
    setIsLoading(true);
    setResultado('Probando conexión...');

    try {
      const res = await fetch('/api/inicio');

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        const msg = errBody?.message || errBody?.error || res.statusText || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      const body = await res.json();
      const mensajeDelServidor = body?.data?.message || body?.message || JSON.stringify(body);

      setResultado(`Conexión Exitosa: ${mensajeDelServidor ? mensajeDelServidor : 'No se recibió mensaje del servidor.'}`);

    } catch (err) {
      console.error('Error al conectar con el backend:', err);
      // Puedes intentar acceder al mensaje de error si el servidor lo envía en caso de fallo
      const errorMessage = err.message || 'Error al conectar. Verifica que el backend esté en ejecución.';
      setResultado(`${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container text-center bg-white p-10 rounded-lg shadow-xl max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Bienvenido al Sistema de Estacionamiento
        </h1>
        
        <button 
          id="btnCheckBackend"
          onClick={handleCheckBackend}
          disabled={isLoading}
          className="px-6 py-3 mt-4 border-none bg-blue-600 text-white rounded-md cursor-pointer 
                     hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Conectando...' : 'Probar conexión al backend'}
        </button>
        
        <div 
          id="resultado" 
          className={`mt-5 font-semibold ${resultado.includes('Conexión Exitosa') ? 'text-green-600' : 'text-red-600'}`}
        >
          {resultado}
        </div>
      </div>
    </div>
  );
}

export default App;