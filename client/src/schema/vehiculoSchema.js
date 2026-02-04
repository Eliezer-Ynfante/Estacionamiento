import { z } from 'zod';

export const crearVehiculoSchema = z.object({
  tipo_vehiculo_id: z
    .number({ message: 'El tipo de vehículo es requerido' })
    .int('El tipo de vehículo debe ser un número entero')
    .positive('El tipo de vehículo debe ser un número positivo'),

  placa: z
    .string({ message: 'La placa es requerida' })
    .min(5, 'La placa debe tener al menos 5 caracteres')
    .max(20, 'La placa no puede exceder 20 caracteres')
    .toUpperCase(),

  marca: z
    .string({ message: 'La marca es requerida' })
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
    .int('El año debe ser un número entero')
    .min(1900, 'El año no es válido')
    .max(new Date().getFullYear(), 'El año no puede ser futuro')
    .optional()
    .nullable()
});

export const actualizarVehiculoSchema = z.object({
  tipo_vehiculo_id: z
    .number()
    .int()
    .positive()
    .optional(),

  placa: z
    .string()
    .min(5)
    .max(20)
    .toUpperCase()
    .optional(),

  marca: z
    .string()
    .min(2)
    .max(50)
    .trim()
    .optional(),

  color: z
    .string()
    .max(30)
    .trim()
    .optional()
    .nullable(),

  año: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .nullable()
});
