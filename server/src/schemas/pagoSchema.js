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
