const { z } = require('zod');

exports.crearReservaSchema = z.object({
  usuario_id: z
    .number()
    .int()
    .positive('El usuario_id debe ser un número positivo'),

  vehiculo_id: z
    .number()
    .int()
    .positive('El vehiculo_id debe ser un número positivo'),

  servicio_id: z
    .number()
    .int()
    .positive('El servicio_id debe ser un número positivo')
    .optional()
    .nullable(),

  fecha_hora_inicio: z
    .string()
    .datetime('La fecha_hora_inicio debe ser un datetime válido'),

  fecha_hora_fin: z
    .string()
    .datetime('La fecha_hora_fin debe ser un datetime válido')
}).refine((data) => {
  const inicio = new Date(data.fecha_hora_inicio);
  const fin = new Date(data.fecha_hora_fin);
  return fin > inicio;
}, {
  message: 'La fecha_hora_fin debe ser posterior a la fecha_hora_inicio',
  path: ['fecha_hora_fin']
});

exports.actualizarReservaSchema = z.object({
  estado: z
    .enum(['pendiente', 'activa', 'completada'], 'El estado no es válido')
    .optional(),

  fecha_hora_fin: z
    .string()
    .datetime()
    .optional()
    .nullable(),

  monto_total: z
    .number()
    .positive()
    .multipleOf(0.01)
    .optional()
});