const { z } = require('zod');

exports.crearVehiculoSchema = z.object({
  usuario_id: z
    .number()
    .int()
    .positive('El usuario_id debe ser un número positivo'),

  tipo_vehiculo_id: z
    .number()
    .int()
    .positive('El tipo_vehiculo_id debe ser un número positivo'),

  placa: z
    .string()
    .min(5, 'La placa debe tener al menos 5 caracteres')
    .max(20, 'La placa no puede exceder 20 caracteres')
    .toUpperCase(),

  marca: z
    .string()
    .min(2, 'La marca debe tener al menos 2 caracteres')
    .max(50, 'La marca no puede exceder 50 caracteres')
    .trim(),

  color: z
    .string()
    .max(30, 'El color no puede exceder 30 caracteres')
    .trim()
    .optional()
    .nullable(),

  año: z
    .number()
    .int()
    .min(1900, 'El año no es válido')
    .max(new Date().getFullYear(), 'El año no puede ser futuro')
    .optional()
    .nullable()
});