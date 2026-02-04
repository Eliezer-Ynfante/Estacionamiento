import { z } from 'zod';

export const actualizarPerfilSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim()
    .optional(),

  correo_electronico: z
    .string()
    .email('El correo no es válido')
    .max(100, 'El correo no puede exceder 100 caracteres')
    .toLowerCase()
    .optional()
});

export const cambiarContraseñaSchema = z.object({
  contraseña_actual: z
    .string({ message: 'La contraseña actual es requerida' })
    .min(1, 'La contraseña actual es requerida'),

  contraseña_nueva: z
    .string({ message: 'La nueva contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial')
});
