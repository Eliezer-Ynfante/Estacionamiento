// api/pagos.js

import { API_BASE_URL } from './config';

/**
 * Valida y procesa un pago con tarjeta
 * NO crea reserva aún, solo valida el pago y devuelve un token
 * @param {Object} pagoData - Datos del pago
 * @param {string} pagoData.cardNumber - Número de tarjeta
 * @param {string} pagoData.cardName - Nombre del titular
 * @param {string} pagoData.expiry - Fecha de expiración (MM/YY)
 * @param {string} pagoData.cvv - CVV de la tarjeta
 * @param {number} pagoData.monto - Monto a pagar
 * @returns {Promise<Object>} Token de pago validado
 */
export const validarPago = async (pagoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pagoData),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data.error || data.errores?.[0]?.mensaje || `Error ${response.status}`;
      const errorData = new Error(error);
      errorData.status = response.status;
      errorData.details = data;
      throw errorData;
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.status) {
      throw error;
    }
    throw new Error(`No se pudo procesar el pago: ${error.message}`);
  }
};