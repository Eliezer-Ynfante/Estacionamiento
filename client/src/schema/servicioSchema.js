import { z } from 'zod';

export const servicioSchema = z.object({
  id: z
    .number()
    .int()
    .positive(),

  nombre: z
    .string()
    .min(2)
    .max(100),

  precio: z
    .number()
    .positive(),

  descripcion: z
    .string()
    .optional()
    .nullable()
});

export const obtenerServiciosSchema = z.array(servicioSchema);
