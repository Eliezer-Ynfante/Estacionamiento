// api/usuario.js

import { API_BASE_URL } from './config';

/**
 * Obtiene el perfil del usuario autenticado
 * @returns {Promise<Object>} Datos del perfil del usuario
 */
export const obtenerMiPerfil = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo obtener el perfil: ${error.message}`);
  }
};

/**
 * Actualiza el perfil del usuario autenticado
 * @param {Object} perfilData - Datos a actualizar
 * @param {string} perfilData.nombre - Nuevo nombre (opcional)
 * @param {string} perfilData.correo_electronico - Nuevo correo (opcional)
 * @returns {Promise<Object>} Perfil actualizado
 */
export const actualizarMiPerfil = async (perfilData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(perfilData),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo actualizar el perfil: ${error.message}`);
  }
};

/**
 * Cambia la contraseña del usuario autenticado
 * @param {Object} passwordData - Datos de contraseña
 * @param {string} passwordData.contraseña_actual - Contraseña actual
 * @param {string} passwordData.contraseña_nueva - Nueva contraseña
 * @returns {Promise<Object>} Confirmación del cambio
 */
export const cambiarContraseña = async (passwordData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/me/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo cambiar la contraseña: ${error.message}`);
  }
};
