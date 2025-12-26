import { useState } from "react";
import { LogIn, Mail, Lock, User, UserPlus, AlertTriangle, CheckCircle } from "lucide-react";

const Contact = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // Solo para registro
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const toggleView = () => {
    setIsRegistering(!isRegistering);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setError(null);
    setSubmitted(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSubmitted(false);

    if (isRegistering) {
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        setIsLoading(false);
        return;
      }
    }

    // Simulación de API
    setTimeout(() => {
      setIsLoading(false);
      
      if (isRegistering) {
        // Lógica de Registro
        setSubmitted(true);
        console.log("Registro exitoso:", formData);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        // Lógica de Login
        if (formData.email === "test@app.com" && formData.password === "123456") {
          alert("¡Bienvenido! Login exitoso.");
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        } else {
          setError("Credenciales inválidas. Inténtalo de nuevo.");
        }
      }
    }, 1500);
  };

  // Títulos y textos dinámicos
  const title = isRegistering ? "Crear Cuenta" : "Iniciar Sesión";
  const buttonText = isRegistering ? "Registrarse" : "Acceder";
  const welcomeTitle = isRegistering ? "Únete a nuestra comunidad" : "¡Bienvenido de vuelta!";
  const welcomeText = isRegistering 
    ? "Crea tu cuenta ahora para reservar tu espacio de estacionamiento de forma rápida y segura."
    : "Accede a tu cuenta para gestionar tus reservas y acceder a servicios exclusivos.";
  const linkText = isRegistering ? "¿Ya tienes cuenta? Iniciar Sesión" : "¿No tienes cuenta? Regístrate aquí";

  const FormIcon = isRegistering ? UserPlus : LogIn;

  return (
    <div className="min-h-screen bg-black font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden lg:grid lg:grid-cols-2">
        
        {/* Columna de Formulario (Orden dinámico) */}
        <div className={`p-8 sm:p-10 lg:p-12 ${isRegistering ? 'order-2 lg:order-1' : 'order-2 lg:order-2'}`}>
          <h2 className="text-3xl font-bold text-white mb-8 text-center uppercase">
            {title.split(' ')[0]}{" "}
            <span className="text-orange-600">{title.split(' ')[1] || ''}</span>
          </h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Campo Nombre (Solo registro) */}
            {isRegistering && (
              <div>
                <label className="text-neutral-400 text-sm mb-2 block font-light">
                  Nombre Completo
                </label>
                <div className="relative flex items-center">
                  <User size={20} className="absolute left-3 text-neutral-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-800 border-b-2 border-neutral-700 focus:border-orange-600 outline-none py-3 pl-10 pr-4 font-light text-white placeholder-neutral-500 transition-colors duration-300"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>
            )}

            {/* Campo Email */}
            <div>
              <label className="text-neutral-400 text-sm mb-2 block font-light">
                Email
              </label>
              <div className="relative flex items-center">
                <Mail size={20} className="absolute left-3 text-neutral-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-800 border-b-2 border-neutral-700 focus:border-orange-600 outline-none py-3 pl-10 pr-4 font-light text-white placeholder-neutral-500 transition-colors duration-300"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="text-neutral-400 text-sm mb-2 block font-light">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <Lock size={20} className="absolute left-3 text-neutral-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-800 border-b-2 border-neutral-700 focus:border-orange-600 outline-none py-3 pl-10 pr-4 font-light text-white placeholder-neutral-500 transition-colors duration-300"
                  placeholder={isRegistering ? "Mínimo 6 caracteres" : "********"}
                />
              </div>
              {!isRegistering && (
                <div className="mt-2 text-right">
                  <a href="#" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}
            </div>
            
            {/* Campo Confirmar Contraseña (Solo registro) */}
            {isRegistering && (
              <div>
                <label className="text-neutral-400 text-sm mb-2 block font-light">
                  Confirmar Contraseña
                </label>
                <div className="relative flex items-center">
                  <Lock size={20} className="absolute left-3 text-neutral-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-800 border-b-2 border-neutral-700 focus:border-orange-600 outline-none py-3 pl-10 pr-4 font-light text-white placeholder-neutral-500 transition-colors duration-300"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>
            )}


            {/* Mensaje de Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-800 text-red-400 text-sm">
                <AlertTriangle size={18} />
                <p>{error}</p>
              </div>
            )}

            {/* Mensaje de Éxito (Solo registro) */}
            {submitted && isRegistering && (
              <div className="flex items-center gap-2 p-3 bg-green-900/30 border border-green-800 text-green-400 text-sm">
                <CheckCircle size={18} />
                <p>¡Registro completado! Ya puedes iniciar sesión.</p>
              </div>
            )}

            {/* Botón Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full group relative overflow-hidden py-3 font-semibold text-base transition-all duration-300 uppercase tracking-wider ${
                  isLoading
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-orange-600 text-black hover:bg-orange-700 active:scale-[0.99] shadow-lg shadow-orange-600/30"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin">
                        <FormIcon size={20} className="text-neutral-500" />
                      </div>
                      <span className="text-neutral-500">{isRegistering ? "Registrando..." : "Accediendo..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{buttonText}</span>
                      <FormIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>
            
            {/* Enlace para cambiar de vista */}
            <p className="text-center text-sm text-neutral-400 mt-4">
              <button 
                type="button" 
                onClick={toggleView}
                className="text-orange-600 hover:text-orange-500 font-semibold transition-colors"
              >
                {linkText}
              </button>
            </p>

          </form>
        </div>

        {/* Columna de Bienvenida/Decoración (Orden dinámico) */}
        <div className={`hidden lg:block p-12 relative overflow-hidden ${isRegistering ? 'order-1 lg:order-2 bg-neutral-950' : 'order-1 lg:order-1 bg-neutral-950'}`}>
          <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">
            {welcomeTitle}
          </h2>
          <p className="text-neutral-400 font-light mb-8">
            {welcomeText}
          </p>
          {/* Patrón de fondo geométrico sutil en naranja */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="geometric-auth" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 0 50 L 50 0 L 100 50 L 50 100 Z" fill="none" stroke="#f97316" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#geometric-auth)" />
            </svg>
          </div>
          <div className="relative z-10 mt-16">
            <p className="text-orange-600 font-semibold text-lg">
              {isRegistering ? "Crea tu perfil" : "Servicios seguros"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;