import { API_BASE_URL } from './config';

/**
 * Realiza login del usuario
 * @param {string} correo_electronico 
 * @param {string} contraseña 
 * @returns {Promise<Object>} Datos del usuario y token
 */
export const apiLogin = async (correo_electronico, contraseña) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo_electronico, contraseña }),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en login');
  }

  return data;
};

/**
 * Valida la sesión actual del usuario
 * Verifica si el JWT en la cookie HttpOnly es válido
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
export const apiValidateSession = async () => {
  const response = await fetch(`${API_BASE_URL}/user/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Envía las cookies automáticamente
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Sesión inválida');
  }

  return data;
};

/**
 * Registra un nuevo usuario
 * @param {Object} userData - { nombre, correo_electronico, contraseña }
 * @returns {Promise<Object>} Datos del usuario registrado y token
 */
export const apiRegister = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: userData.nombre,
      correo_electronico: userData.correo_electronico,
      contraseña: userData.contraseña,
    }),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en registro');
  }

  return data;
};

/**
 * Realiza logout del usuario
 * @returns {Promise<Object>}
 */
export const apiLogout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en logout');
  }

  return data;
};