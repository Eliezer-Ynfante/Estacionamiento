const { z } = require('zod');

exports.crearUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),

  correo_electronico: z
    .email('El correo no es válido')
    .max(100, 'El correo no puede exceder 100 caracteres')
    .toLowerCase(),

  contraseña: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial')
});

exports.actualizarUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .max(100)
    .trim()
    .optional(),

  correo_electronico: z
    .email()
    .max(100)
    .toLowerCase()
    .optional()
}).strict();
