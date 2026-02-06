// api/vehiculos.js

import { API_BASE_URL } from './config';

/**
 * Obtiene los vehículos del usuario autenticado
 * @returns {Promise<Array>} Lista de vehículos del usuario
 */
export const obtenerMisVehiculos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicle/me`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudieron obtener los vehículos: ${error.message}`);
  }
};

/**
 * Obtiene un vehículo específico por su ID
 * @param {number} vehiculoId - ID del vehículo
 * @returns {Promise<Object>} Datos del vehículo
 */
export const obtenerVehiculoPorId = async (vehiculoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicle/${vehiculoId}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo obtener el vehículo: ${error.message}`);
  }
};

/**
 * Crea un nuevo vehículo para el usuario
 * @param {Object} vehiculoData - Datos del vehículo
 * @param {number} vehiculoData.tipo_vehiculo_id - Tipo de vehículo
 * @param {string} vehiculoData.placa - Placa del vehículo
 * @param {string} vehiculoData.marca - Marca del vehículo
 * @param {string} vehiculoData.color - Color del vehículo (opcional)
 * @param {number} vehiculoData.año - Año del vehículo (opcional)
 * @returns {Promise<Object>} Vehículo creado
 */
export const crearVehiculo = async (vehiculoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicle/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehiculoData),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo crear el vehículo: ${error.message}`);
  }
};

/**
 * Actualiza un vehículo existente
 * @param {number} vehiculoId - ID del vehículo
 * @param {Object} vehiculoData - Datos a actualizar
 * @returns {Promise<Object>} Vehículo actualizado
 */
export const actualizarVehiculo = async (vehiculoId, vehiculoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicle/${vehiculoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehiculoData),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo actualizar el vehículo: ${error.message}`);
  }
};

/**
 * Elimina un vehículo del usuario
 * @param {number} vehiculoId - ID del vehículo a eliminar
 * @returns {Promise<Object>} Respuesta de eliminación
 */
export const eliminarVehiculo = async (vehiculoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicle/${vehiculoId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo eliminar el vehículo: ${error.message}`);
  }
};

/**
 * Obtiene todos los tipos de vehículos disponibles
 * @returns {Promise<Array>} Lista de tipos de vehículos
 */
export const obtenerTiposVehiculos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicle/types`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudieron obtener los tipos de vehículos: ${error.message}`);
  }
};