import { z } from 'zod';

export const tarifaSchema = z.object({
  id: z
    .number()
    .int()
    .positive(),

  tipo_vehiculo_id: z
    .number()
    .int()
    .positive(),

  precio_hora: z
    .string()
    .or(z.number())
    .transform((val) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? 0 : num;
    }),

  precio_dia: z
    .string()
    .or(z.number())
    .transform((val) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? 0 : num;
    }),

  precio_semana: z
    .string()
    .or(z.number())
    .transform((val) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? 0 : num;
    }),

  tipo: z
    .object({
      id: z.number().int().positive(),
      nombre: z.string().min(1)
    })
    .optional()
});

export const obtenerTarifasSchema = z.array(tarifaSchema);
