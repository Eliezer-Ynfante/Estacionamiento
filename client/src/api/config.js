// Configuración base de la API desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3050/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '5000', 10);

export { API_BASE_URL, API_TIMEOUT };