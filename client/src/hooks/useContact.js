import { useState } from "react";
import { validateContactFormSafe } from "@schema/contactSchema";

const initialFormData = {
  nombre: "",
  apellido: "",
  email: "",
  asunto: "",
  mensaje: "",
};

export const useContact = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateContactFormSafe(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          email: formData.email.trim(),
          asunto: formData.asunto.trim(),
          mensaje: formData.mensaje.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.mensaje || "Error al enviar el mensaje");
      }

      setSubmitted(true);
      setFormData(initialFormData);
      setErrors({});

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setSubmitError(error.message || "Error al enviar el mensaje. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitError(null);
    setSubmitted(false);
  };

  return {
    formData,
    errors,
    submitted,
    isLoading,
    submitError,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
