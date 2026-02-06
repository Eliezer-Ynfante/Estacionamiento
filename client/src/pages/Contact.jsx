import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle } from "lucide-react";
import { useContact } from "@hooks/useContact";

const Contact = () => {
  const { formData, errors, submitted, isLoading, submitError, handleChange, handleSubmit } = useContact();

  return (
    <section className="min-h-screen bg-black py-16 px-4 font-sans">
      <style>{`
        /* Configuración de fuente Montserrat */
        /* Aseguramos que la tipografía principal sea Montserrat/Open Sans */
        .font-sans, .font-montserrat, .font-open-sans {
            font-family: 'Montserrat', 'Open Sans', sans-serif !important;
        }

        /* Estilo de input minimalista para fondo oscuro */
        .input-contact {
            background-color: transparent;
            border: none;
            border-bottom: 2px solid #3f3f46; /* neutral-700 */
            outline: none;
            padding: 0.75rem 0.25rem;
            color: white;
            transition: border-color 0.3s;
        }
        .input-contact:focus {
            border-bottom-color: #f97316; /* orange-600 */
        }
        .input-contact::placeholder {
            color: #52525b; /* neutral-600 */
        }
        /* Estilo para el textarea */
        .textarea-contact {
            background-color: #0a0a0a; /* neutral-950 más oscuro */
            border: 1px solid #3f3f46; /* neutral-700 */
            border-radius: 0.5rem;
            padding: 1rem;
            color: white;
            transition: border-color 0.3s;
        }
        .textarea-contact:focus {
            border-color: #f97316; /* orange-600 */
            outline: none;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="font-semibold text-4xl md:text-5xl text-white mb-4 uppercase tracking-widest">
            <span className="text-orange-600 font-bold">Contáctanos</span>
          </h1>
          <p className="text-neutral-500 text-base max-w-2xl mx-auto font-light">
            ¿Tienes dudas sobre nuestros servicios de estacionamiento? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-8 mb-16">
          
          {/* Columna de Información de Contacto (lg:col-span-1) */}
          <div className="lg:col-span-1 space-y-6">
            
            <h2 className="text-2xl font-light text-white mb-4 uppercase tracking-wider border-b border-neutral-800 pb-3">
                Información
            </h2>
            
            {/* Email */}
            <a href="mailto:contacto@estacionamiento.pe" className="block">
              <div className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 transform hover:bg-neutral-900 border border-neutral-800 hover:border-orange-600 shadow-md">
                <div className="bg-orange-600 p-3 rounded-full text-black shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-0.5 text-lg">Email</h3>
                  <p className="text-neutral-300 text-sm">contacto@estacionamiento.pe</p>
                  <p className="text-neutral-500 text-xs mt-1">Respuesta en 24 horas</p>
                </div>
              </div>
            </a>

            {/* Teléfono */}
            <a href="tel:+51123456789" className="block">
              <div className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 transform hover:bg-neutral-900 border border-neutral-800 hover:border-orange-600 shadow-md">
                <div className="bg-orange-600 p-3 rounded-full text-black shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-0.5 text-lg">Teléfono</h3>
                  <p className="text-neutral-300 text-sm">+51 (1) 2345-6789</p>
                  <p className="text-neutral-500 text-xs mt-1">Lun - Vie: 8am - 6pm</p>
                </div>
              </div>
            </a>

            {/* Ubicación */}
            <div className="group">
              <div className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 transform hover:bg-neutral-900 border border-neutral-800 hover:border-orange-600 shadow-md">
                <div className="bg-orange-600 p-3 rounded-full text-black shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-0.5 text-lg">Ubicación</h3>
                  <p className="text-neutral-300 text-sm">Av. Principal 1234</p>
                  <p className="text-neutral-500 text-xs mt-1">Lima, Perú</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna del Formulario (lg:col-span-2) */}
          <div className="lg:col-span-2 bg-neutral-950 p-6 sm:p-8 rounded-xl border border-neutral-800 shadow-2xl">
            <h2 className="text-2xl font-light text-white mb-6 uppercase tracking-wider">
                Envíanos un Mensaje
            </h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Nombre y Apellido (Responsivo) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-neutral-400 text-sm mb-2 block font-light">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full input-contact ${errors.nombre ? 'border-red-500' : ''}`}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.nombre}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-neutral-400 text-sm mb-2 block font-light">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={`w-full input-contact ${errors.apellido ? 'border-red-500' : ''}`}
                    placeholder="Tu apellido"
                  />
                  {errors.apellido && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.apellido}
                    </p>
                  )}
                </div>
              </div>

              {/* Email y Asunto (Responsivo) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-neutral-400 text-sm mb-2 block font-light">
                    Email <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full input-contact ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-neutral-400 text-sm mb-2 block font-light">
                    Asunto
                  </label>
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    className={`w-full input-contact ${errors.asunto ? 'border-red-500' : ''}`}
                    placeholder="¿En qué podemos ayudarte?"
                  />
                  {errors.asunto && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.asunto}
                    </p>
                  )}
                </div>
              </div>

              {/* Mensaje (Usa la clase de textarea) */}
              <div>
                <label className="text-neutral-400 text-sm mb-2 block font-light">
                  Mensaje <span className="text-neutral-600 text-xs ml-2">({formData.mensaje.length}/1000)</span>
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full textarea-contact resize-none ${errors.mensaje ? 'border-red-500' : ''}`}
                  placeholder="Cuéntanos con detalle..."
                />
                {errors.mensaje && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.mensaje}
                  </p>
                )}
              </div>

              {/* Botón Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full group relative overflow-hidden rounded-lg py-3 font-semibold text-base transition-all duration-300 uppercase tracking-wider ${
                    isLoading
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "bg-orange-600 text-black hover:bg-orange-700 active:scale-[0.99] shadow-lg shadow-orange-600/30"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <div className="animate-spin">
                          <Send size={20} className="text-neutral-500" />
                        </div>
                        <span className="text-neutral-500">Enviando...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar Mensaje</span>
                        <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Mensaje de Éxito */}
              {submitted && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-green-600/10 border-l-4 border-green-600 p-4 rounded flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-500">
                      ¡Mensaje enviado exitosamente!
                    </p>
                    <p className="text-green-400 text-sm mt-1">
                      Nos pondremos en contacto pronto a través del email proporcionado.
                    </p>
                  </div>
                </div>
              )}
              {/* Mensaje de Error */}
              {submitError && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-red-600/10 border-l-4 border-red-600 p-4 rounded flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-500">
                      Error al enviar el mensaje
                    </p>
                    <p className="text-red-400 text-sm mt-1">
                      {submitError}
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;