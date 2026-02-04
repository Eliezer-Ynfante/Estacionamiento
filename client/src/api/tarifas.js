import { API_BASE_URL } from "./config";

/**
 * Obtiene todas las tarifas disponibles
 * @returns {Promise<Object>} Objeto con tarifas
 */
export const obtenerTodasTarifas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rate/rates`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudieron obtener las tarifas: ${error.message}`);
  }
};

/**
 * Obtiene una tarifa por su ID
 * @param {number} tarifaId - ID de la tarifa
 * @returns {Promise<Object>} Objeto con información de la tarifa
 */
export const obtenerTarifaPorId = async (tarifaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rate/rates/${tarifaId}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo obtener la tarifa: ${error.message}`);
  }
};

/**
 * Obtiene tarifa por tipo de vehículo
 * @param {number} tipoVehiculoId - ID del tipo de vehículo
 * @returns {Promise<Object>} Objeto con tarifa del tipo
 */
export const obtenerTarifaPorTipo = async (tipoVehiculoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rate/vehicle/${tipoVehiculoId}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo obtener la tarifa: ${error.message}`);
  }
};
