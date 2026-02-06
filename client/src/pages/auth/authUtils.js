/**
 * Convierte errores de Zod o del servidor en mensajes amigables
 * @param {Error} error - El error a procesar
 * @returns {string} Mensaje de error amigable
 */
export const getErrorMessage = (error) => {
  // Si es un error de validación de Zod
  if (error?.issues && Array.isArray(error.issues)) {
    const firstIssue = error.issues[0];
    return firstIssue.message || 'Validación fallida';
  }

  // Si es un error con mensaje del servidor
  if (error?.message) {
    const msg = error.message.toLowerCase();

    // Errores de conexión
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }

    // Si el mensaje del servidor es legible, usarlo
    if (msg.includes('correo') || msg.includes('contraseña') || msg.includes('registrado')) {
      return error.message;
    }

    // Mensajes técnicos - no exponer
    if (msg.includes('expected') || msg.includes('received') || msg.includes('undefined')) {
      return 'Error al procesar la solicitud. Intenta nuevamente.';
    }

    return error.message;
  }

  return 'Ha ocurrido un error desconocido. Intenta nuevamente.';
};
