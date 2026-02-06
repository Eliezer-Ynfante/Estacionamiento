const { z } = require('zod');

exports.crearPagoSchema = z.object({
  reserva_id: z
    .number()
    .int()
    .positive('El reserva_id debe ser un número positivo'),

  monto: z
    .number()
    .positive('El monto debe ser positivo')
    .multipleOf(0.01, 'El monto debe tener máximo 2 decimales'),

  metodo_pago: z
    .string()
    .min(3, 'El metodo_pago debe tener al menos 3 caracteres')
    .max(50, 'El metodo_pago no puede exceder 50 caracteres')
    .trim(),

  fecha_pago: z
    .string()
    .datetime('La fecha_pago debe ser un datetime válido')
    .optional()
    .nullable()
});

// Schema para validar pago ANTES de crear la reserva
exports.validarPagoSchema = z.object({
  cardNumber: z
    .string()
    .trim()
    .min(13, 'El número de tarjeta debe tener al menos 13 dígitos')
    .regex(/^\d{13,19}$/, 'Número de tarjeta inválido (13-19 dígitos)'),

  cardName: z
    .string()
    .trim()
    .min(3, 'El nombre del titular debe tener al menos 3 caracteres')
    .max(100, 'El nombre del titular no puede exceder 100 caracteres'),

  expiry: z
    .string()
    .trim()
    .regex(/^\d{2}\/\d{2}$/, 'Formato de expiración inválido (MM/YY)')
    .refine((value) => {
      const [month, year] = value.split('/');
      const m = parseInt(month);
      const y = parseInt(year) + 2000;
      const now = new Date();
      const expDate = new Date(y, m, 0);
      return expDate >= now;
    }, 'La tarjeta ha expirado'),

  cvv: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, 'CVV inválido (3-4 dígitos)'),

  monto: z
    .number()
    .positive('El monto debe ser un número positivo')
    .finite('El monto debe ser un número válido')
    .refine(val => val > 0, 'El monto debe ser mayor a 0')
});
