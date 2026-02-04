import { z } from 'zod';

export const crearReservaSchema = z.object({
  vehiculo_id: z
    .number({ message: 'El vehículo es requerido' })
    .int('El ID del vehículo debe ser un número entero')
    .positive('El ID del vehículo debe ser un número positivo'),

  servicio_id: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),

  fecha_hora_inicio: z
    .string({ message: 'La fecha de inicio es requerida' })
    .datetime('La fecha_hora_inicio debe ser un datetime válido'),

  fecha_hora_fin: z
    .string({ message: 'La fecha de fin es requerida' })
    .datetime('La fecha_hora_fin debe ser un datetime válido')
}).refine((data) => {
  const inicio = new Date(data.fecha_hora_inicio);
  const fin = new Date(data.fecha_hora_fin);
  return fin > inicio;
}, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['fecha_hora_fin']
});

export const actualizarReservaSchema = z.object({
  estado: z
    .enum(['pendiente', 'activa', 'completada'], { message: 'El estado no es válido' })
    .optional(),

  fecha_hora_fin: z
    .string()
    .datetime()
    .optional()
    .nullable(),

  monto_total: z
    .number()
    .positive('El monto debe ser positivo')
    .multipleOf(0.01)
    .optional()
});

export const cancelarReservaSchema = z.object({
  reserva_id: z
    .number()
    .int()
    .positive('El ID de la reserva debe ser un número positivo')
});
