import { z } from 'zod';

export const crearPagoSchema = z.object({
  reserva_id: z
    .number({ message: 'El ID de la reserva es requerido' })
    .int('El ID debe ser un número entero')
    .positive('El ID debe ser un número positivo'),

  monto: z
    .number({ message: 'El monto es requerido' })
    .positive('El monto debe ser un número positivo'),

  numero_tarjeta: z
    .string({ message: 'El número de tarjeta es requerido' })
    .regex(/^\d{13,19}$/, 'El número de tarjeta debe tener entre 13 y 19 dígitos'),

  cvv: z
    .string({ message: 'El CVV es requerido' })
    .regex(/^\d{3,4}$/, 'El CVV debe tener 3 o 4 dígitos'),

  fecha_expiracion: z
    .string({ message: 'La fecha de expiración es requerida' })
    .regex(/^\d{2}\/\d{2}$/, 'El formato debe ser MM/YY'),

  nombre_titular: z
    .string({ message: 'El nombre del titular es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim()
});

export const procesarPagoSchema = z.object({
  monto: z
    .number()
    .positive('El monto debe ser un número positivo'),

  numero_tarjeta: z
    .string()
    .regex(/^\d{13,19}$/, 'Tarjeta inválida'),

  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV inválido'),

  fecha_expiracion: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, 'Formato inválido'),

  nombre_titular: z
    .string()
    .min(3)
    .max(100)
    .trim()
});
