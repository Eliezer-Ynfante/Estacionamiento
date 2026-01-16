export const validateContactForm = (formData) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validar nombre
  if (!formData.nombre?.trim()) {
    errors.nombre = "El nombre es requerido";
  } else if (formData.nombre.trim().length < 2) {
    errors.nombre = "El nombre debe tener al menos 2 caracteres";
  } else if (formData.nombre.trim().length > 50) {
    errors.nombre = "El nombre no puede exceder 50 caracteres";
  }

  // Validar apellido
  if (!formData.apellido?.trim()) {
    errors.apellido = "El apellido es requerido";
  } else if (formData.apellido.trim().length < 2) {
    errors.apellido = "El apellido debe tener al menos 2 caracteres";
  } else if (formData.apellido.trim().length > 50) {
    errors.apellido = "El apellido no puede exceder 50 caracteres";
  }

  // Validar email
  if (!formData.email?.trim()) {
    errors.email = "El email es requerido";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Ingresa un email válido";
  }

  // Validar asunto
  if (!formData.asunto?.trim()) {
    errors.asunto = "El asunto es requerido";
  } else if (formData.asunto.trim().length < 3) {
    errors.asunto = "El asunto debe tener al menos 3 caracteres";
  } else if (formData.asunto.trim().length > 100) {
    errors.asunto = "El asunto no puede exceder 100 caracteres";
  }

  // Validar mensaje
  if (!formData.mensaje?.trim()) {
    errors.mensaje = "El mensaje es requerido";
  } else if (formData.mensaje.trim().length < 10) {
    errors.mensaje = "El mensaje debe tener al menos 10 caracteres";
  } else if (formData.mensaje.trim().length > 1000) {
    errors.mensaje = "El mensaje no puede exceder 1000 caracteres";
  }

  return errors;
};
