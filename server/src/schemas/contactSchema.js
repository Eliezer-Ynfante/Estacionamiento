const { z } = require('zod');

const nombreApellidoRegex = /^[a-záéíóúñ\s'-]+$/i;

exports.contactoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener entre 2 y 50 caracteres')
    .max(50, 'El nombre debe tener entre 2 y 50 caracteres')
    .regex(nombreApellidoRegex, 'El nombre contiene caracteres no permitidos'),

  apellido: z
    .string()
    .trim()
    .min(2, 'El apellido debe tener entre 2 y 50 caracteres')
    .max(50, 'El apellido debe tener entre 2 y 50 caracteres')
    .regex(nombreApellidoRegex, 'El apellido contiene caracteres no permitidos'),

  email: z
    .string()
    .trim()
    .min(1, 'El email es requerido')
    .email('Debes proporcionar un email válido')
    .max(100, 'El email no puede exceder 100 caracteres'),

  asunto: z
    .string()
    .trim()
    .min(3, 'El asunto debe tener entre 3 y 100 caracteres')
    .max(100, 'El asunto debe tener entre 3 y 100 caracteres'),

  mensaje: z
    .string()
    .trim()
    .min(10, 'El mensaje debe tener entre 10 y 1000 caracteres')
    .max(1000, 'El mensaje debe tener entre 10 y 1000 caracteres'),
});
