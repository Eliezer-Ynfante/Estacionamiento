const { z } = require('zod');
const { Reserva, Pago } = require('../models');
const { validarPagoSchema } = require('../schemas/pagoSchema');

// =====================================================
// FUNCIONES AUXILIARES DE VALIDACIÓN
// =====================================================

/**
 * Valida el número de tarjeta usando el algoritmo de Luhn
 */
const validarTarjeta = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Simula el procesamiento de pago con un proveedor (en desarrollo)
 * En producción, esto se conectaría con Stripe, PayPal, etc.
 */
const procesarPagoConProveedor = async (cardData, monto) => {
  // Simular procesamiento
  return new Promise((resolve) => {
    setTimeout(() => {
      // 95% de probabilidad de éxito en desarrollo
      const exitoso = Math.random() < 0.95;
      
      if (exitoso) {
        resolve({
          exitoso: true,
          transaccionId: `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          mensaje: 'Pago procesado exitosamente'
        });
      } else {
        resolve({
          exitoso: false,
          transaccionId: null,
          mensaje: 'Fondo insuficientes o tarjeta rechazada'
        });
      }
    }, 1000);
  });
};

/**
 * Genera un token temporal para el pago
 */
const generarTokenPago = () => {
  return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// =====================================================
// CONTROLADOR: VALIDAR Y PROCESAR PAGO (SIN CREAR RESERVA)
// =====================================================

exports.validarPago = async (req, res) => {
  try {
    // Validar datos con Zod
    const validacion = validarPagoSchema.safeParse(req.body);

    if (!validacion.success) {
      console.error('Errores de validación de pago:', validacion.error.issues);
      return res.status(400).json({
        success: false,
        errores: validacion.error.issues.map(err => ({
          campo: err.path.join('.'),
          mensaje: err.message
        }))
      });
    }

    const datosValidados = validacion.data;
    const { cardNumber, cardName, expiry, cvv, monto } = datosValidados;

    // 1. Validar número de tarjeta
    if (!validarTarjeta(cardNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Número de tarjeta inválido'
      });
    }

    // 2. Procesar pago con proveedor
    const resultadoPago = await procesarPagoConProveedor(
      { cardNumber, cardName, expiry, cvv },
      monto
    );

    if (!resultadoPago.exitoso) {
      return res.status(402).json({
        success: false,
        error: resultadoPago.mensaje || 'El pago fue rechazado',
        reintentos_disponibles: 3 // Frontend lo maneja
      });
    }

    // 3. Pago exitoso - Generar token temporal
    const paymentToken = generarTokenPago();
    
    // Guardar token en memoria (en producción usar Redis o BD)
    // Por ahora lo incluimos en la respuesta y el cliente lo envía con la reserva
    const tokenData = {
      token: paymentToken,
      transaccionId: resultadoPago.transaccionId,
      cardLast4: cardNumber.slice(-4),
      monto: monto,
      fecha: new Date(),
      usuario_id: req.user.id
    };

    return res.status(200).json({
      success: true,
      mensaje: 'Pago validado exitosamente',
      data: {
        paymentToken,
        transaccionId: resultadoPago.transaccionId,
        monto: monto,
        ultimosCuatro: cardNumber.slice(-4)
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errores: error.issues.map(err => ({
          campo: err.path.join('.'),
          mensaje: err.message
        }))
      });
    }

    console.error('Error al validar pago:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
