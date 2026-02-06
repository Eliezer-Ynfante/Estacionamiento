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
    .nullish(),

  fecha_hora_inicio: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)),

  fecha_hora_fin: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)),

  paymentToken: z
    .string()
    .min(5, 'El paymentToken es requerido')
    .optional()
    .nullable()
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