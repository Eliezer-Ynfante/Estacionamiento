import { z } from 'zod';

// Schema para validar un usuario (respuesta del servidor)
export const UserSchema = z.object({
  id: z.number().int().optional(),
  nombre: z.string().min(1, 'Nombre es requerido'),
  correo_electronico: z.email('Correo inválido'),
  activo: z.boolean().optional(),
}).partial();

// Schema para el estado de autenticación
export const AuthStateSchema = z.object({
  user: UserSchema.nullable(),
  token: z.string().nullable(),
  isAuthenticated: z.boolean(),
});

// Schema para login
export const LoginSchema = z.object({
  correo_electronico: z.email('El correo electrónico no es válido'),
  contraseña: z.string().min(8, 'La contraseña debe tener mínimo 8 caracteres'),
});

// Schema para registro
export const RegisterSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100),
  correo_electronico: z.email('El correo electrónico no es válido'),
  contraseña: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial'),
  confirmPassword: z.string().min(8, 'Confirmación requerida'),
}).refine((data) => data.contraseña === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Schema para respuesta del servidor
export const AuthResponseSchema = z.object({
  success: z.boolean().optional(),
  data: UserSchema.optional(),
  token: z.string(),
  mensaje: z.string().optional(),
}).passthrough();