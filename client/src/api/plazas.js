// api/plazas.js

import { API_BASE_URL } from './config';

/**
 * Obtiene todas las plazas disponibles del servidor
 * @returns {Promise<Object>} Objeto con todas las plazas organizadas por estado
 */
export const obtenerPlazas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/plaza/plazas`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validar que los datos tengan la estructura esperada
    if (!data || typeof data !== 'object') {
      throw new Error("Estructura de datos inválida");
    }
    
    return data;
  } catch (error) {
    throw new Error(`No se pudieron obtener las plazas: ${error.message}`);
  }
};

/**
 * Obtiene plazas disponibles para un rango de fechas
 * @param {string} fechaInicio - Fecha de inicio (formato: YYYY-MM-DD)
 * @param {string} fechaFin - Fecha de fin (formato: YYYY-MM-DD)
 * @returns {Promise<Object>} Objeto con plazas disponibles en el rango de fechas
 */
export const obtenerPlazasDisponibles = async (fechaInicio, fechaFin) => {
  try {
    const params = new URLSearchParams({
      fechaInicio,
      fechaFin
    });
    
    const response = await fetch(
      `${API_BASE_URL}/plaza/plazas/disponibles?${params.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    throw new Error(`No se pudieron obtener plazas disponibles: ${error.message}`);
  }
};

/**
 * Obtiene información de una plaza específica
 * @param {number} plazaId - ID de la plaza
 * @returns {Promise<Object>} Objeto con información de la plaza
 */
export const obtenerPlazaPorId = async (plazaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/plaza/${plazaId}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    throw new Error(`No se pudo obtener la plaza: ${error.message}`);
  }
};

/**
 * Obtiene plazas filtradas por tipo
 * @param {string} tipo - Tipo de plaza (Moto, Auto, Camión)
 * @returns {Promise<Object>} Objeto con plazas del tipo especificado
 */
export const obtenerPlazasPorTipo = async (tipo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/plaza/tipo/${tipo}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    throw new Error(`No se pudieron obtener plazas del tipo ${tipo}: ${error.message}`);
  }
};

/**
 * Reserva una o más plazas
 * @param {Array<number>} plazaIds - Array con IDs de plazas a reservar
 * @param {Object} datos - Objeto con información de la reserva (usuario, fechas, etc.)
 * @returns {Promise<Object>} Objeto con confirmación de la reserva
 */
export const reservarPlazas = async (plazaIds, datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plazas: plazaIds,
        ...datos
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    throw new Error(`No se pudieron reservar las plazas: ${error.message}`);
  }
};

/**
 * Obtiene tarifas disponibles
 * @returns {Promise<Array>} Array con todas las tarifas
 */
export const obtenerTarifas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tarifas`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    throw new Error(`No se pudieron obtener las tarifas: ${error.message}`);
  }
};

export default {
  obtenerPlazas,
  obtenerPlazasDisponibles,
  obtenerPlazaPorId,
  obtenerPlazasPorTipo,
  reservarPlazas,
  obtenerTarifas
};