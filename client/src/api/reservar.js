// api/reservar.js

import { API_BASE_URL } from './config';

/**
 * Crea una nueva reserva
 * @param {Object} reservaData - Datos de la reserva
 * @param {number} reservaData.vehiculo_id - ID del vehículo
 * @param {string} reservaData.fecha_hora_inicio - Fecha y hora de inicio (ISO string)
 * @param {string} reservaData.fecha_hora_fin - Fecha y hora de fin (ISO string)
 * @param {number} reservaData.servicio_id - ID del servicio adicional (opcional)
 * @returns {Promise<Object>} Resultado de la reserva
 */
export const crearReserva = async (reservaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservaData),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      // Construir mensaje de error detallado
      let errorMsg = data.message || data.error || `Error ${response.status}`;
      
      if (data.errores && Array.isArray(data.errores)) {
        errorMsg = data.errores.map(e => `${e.campo}: ${e.mensaje}`).join(', ');
      }
      
      const error = new Error(errorMsg);
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Si el error ya es del tipo que esperamos, propagarlo
    if (error instanceof Error && error.status) {
      throw error;
    }
    // Otro tipo de error (de red, etc)
    throw new Error(`No se pudo crear la reserva: ${error.message}`);
  }
};

/**
 * Obtiene el historial de reservas del usuario autenticado
 * @returns {Promise<Array>} Lista de reservas del usuario
 */
export const obtenerMisReservas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/me`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo obtener el historial: ${error.message}`);
  }
};

/**
 * Obtiene una reserva específica por su ID
 * @param {number} reservaId - ID de la reserva
 * @returns {Promise<Object>} Datos de la reserva
 */
export const obtenerReservaPorId = async (reservaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/${reservaId}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`No se pudo obtener la reserva: ${error.message}`);
  }
};

/**
 * Cancela una reserva existente
 * @param {number} reservaId - ID de la reserva a cancelar
 * @returns {Promise<Object>} Resultado de la cancelación
 */
export const cancelarReserva = async (reservaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/${reservaId}`, {
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
    throw new Error(`No se pudo cancelar la reserva: ${error.message}`);
  }
};