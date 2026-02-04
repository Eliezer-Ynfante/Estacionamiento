const { z } = require('zod');

exports.crearHistorialPlazaSchema = z.object({
  plaza_id: z
    .number()
    .int()
    .positive('El plaza_id debe ser un número positivo'),

  fecha_inicio: z
    .string()
    .datetime('La fecha_inicio debe ser un datetime válido'),

  fecha_fin: z
    .string()
    .datetime('La fecha_fin debe ser un datetime válido')
    .optional()
    .nullable(),

  reserva_id: z
    .number()
    .int()
    .positive('El reserva_id debe ser un número positivo')
    .optional()
    .nullable()
});