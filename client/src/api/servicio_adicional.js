import { API_BASE_URL } from './config';

/**
 * Obtiene todos los servicios disponibles
 * @returns {Promise<Object>} Objeto con lista de servicios
 */
export const obtenerServicios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/service/services`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudieron obtener los servicios: ${error.message}`);
  }
};