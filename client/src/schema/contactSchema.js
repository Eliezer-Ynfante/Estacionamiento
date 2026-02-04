import { z } from 'zod';

// Schema principal para el formulario de contacto
export const ContactFormSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
  apellido: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .trim(),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido')
    .trim(),
  asunto: z
    .string()
    .min(1, 'El asunto es requerido')
    .min(3, 'El asunto debe tener al menos 3 caracteres')
    .max(100, 'El asunto no puede exceder 100 caracteres')
    .trim(),
  mensaje: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres')
    .trim(),
});

// Función para validar el formulario y retornar errores
export const validateContactForm = (formData) => {
  try {
    ContactFormSchema.parse(formData);
    return {}; // Sin errores
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convertir errores de Zod a formato de objeto
      return error.errors.reduce((acc, err) => {
        const field = err.path[0]; // Obtener el nombre del campo
        acc[field] = err.message; // Asignar el mensaje de error
        return acc;
      }, {});
    }
    return { general: 'Error de validación' };
  }
};

// Función alternativa que retorna el resultado completo de Zod
export const validateContactFormSafe = (formData) => {
  return ContactFormSchema.safeParse(formData);
};