import { useState, useEffect, useRef } from "react"
import { Shield, Leaf, Users } from "lucide-react"
// Asumiendo que 'persona' es una ruta de imagen válida en tu proyecto
import persona from "../../assets/image/p1.png" 

export function AboutView() {
  const [activeTab, setActiveTab] = useState("mision")
  const [visibleSections, setVisibleSections] = useState(new Set())
  const sectionRefs = useRef({})

  // Lógica de Intersection Observer para las animaciones al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.2 },
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-black font-sans">
      <style>{`
        /* Configuración de fuente Montserrat */
        .font-sans {
            font-family: 'Montserrat', 'Open Sans', sans-serif !important;
        }
      `}</style>

      {/* Hero Section - Encabezado y Contexto */}
      {/* Mantiene el tamaño original (pb-40) y el patrón blanco sin borde inferior. */}
      <div className="relative bg-black pt-32 pb-40 overflow-hidden"> 
        
        {/* Geometric pattern overlay - Líneas en blanco, sin borde inferior */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geometric-white" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                {/* Geometría con líneas BLANCAS */}
                <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="none" stroke="#ffffff" strokeWidth="1" />
                <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="8" fill="none" stroke="#ffffff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geometric-white)" />
          </svg>
        </div>
        
        {/* Header text content */}
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
            ¿<span className="text-orange-600">Quiénes</span> Somos?
          </h1>
          <p className="text-neutral-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Somos una empresa 100% peruana que cuenta con profesionales que tienen más de 15 años de experiencia
            buscando una solución integral al sistema de estacionamientos.
          </p>
        </div>
      </div>

      {/* Sección Misión/Visión con Contenido y Pestañas */}
      <div className="container mx-auto px-6 -mt-20 pb-20 relative z-5">
        <div className="bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl shadow-orange-600/10">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left side: Text content with tabs - CLAVE: Ajuste de padding a 'p-10' (antes p-16) */}
            <div className="flex-1 p-8 md:p-10 lg:p-10">
              <span className="text-orange-600 text-sm uppercase tracking-wider font-semibold">
                Sobre nosotros
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-8">
                Nuestros Lineamientos
              </h2>

              {/* Tabbed interface */}
              <div className="flex gap-2 mb-8 border-b border-neutral-800">
                <button
                  onClick={() => setActiveTab("mision")}
                  className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
                    activeTab === "mision" 
                      ? "bg-transparent text-orange-600 border-orange-600" 
                      : "bg-transparent text-neutral-500 border-transparent hover:border-neutral-700"
                  }`}
                >
                  Misión
                </button>
                <button
                  onClick={() => setActiveTab("vision")}
                  className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
                    activeTab === "vision" 
                      ? "bg-transparent text-orange-600 border-orange-600" 
                      : "bg-transparent text-neutral-500 border-transparent hover:border-neutral-700"
                  }`}
                >
                  Visión
                </button>
              </div>

              {/* Tab content */}
              <div className="text-neutral-400 leading-relaxed text-lg font-light">
                {activeTab === "mision" ? (
                  <p className="animate-fade-in">
                    Nuestra misión es brindar soluciones integrales de estacionamiento que garanticen la seguridad,
                    comodidad y satisfacción de nuestros clientes. Nos comprometemos a ofrecer un servicio de
                    excelencia, utilizando tecnología de vanguardia y un equipo humano altamente capacitado,
                    contribuyendo así al ordenamiento urbano y la movilidad sostenible de las ciudades peruanas.
                  </p>
                ) : (
                  <p className="animate-fade-in">
                    Ser la empresa líder en gestión de estacionamientos en el Perú, reconocida por nuestra innovación
                    tecnológica, excelencia operativa y compromiso con el desarrollo sostenible. Aspiramos a transformar
                    la experiencia de estacionamiento, convirtiéndola en un servicio eficiente, seguro y accesible para
                    todos los peruanos.
                  </p>
                )}
              </div>
              
              {/* Bloque de Valor Adicional */}
               <div className="mt-8 p-4 bg-neutral-800 border-l-4 border-orange-600">
                  <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-orange-600 flex-shrink-0" />
                      <p className="text-sm text-neutral-300 font-semibold">
                          <span className="text-white">Experiencia:</span> Más de 15 años liderando la gestión de parqueos en Perú.
                      </p>
                  </div>
              </div>
            </div>

            {/* Right side: Image */}
            <div className="flex-1 min-h-[300px] lg:min-h-auto">
              <img
                src={persona}
                alt="Estación de control de estacionamiento"
                className="w-full h-[600px] object-cover lg:aspect-[2/3]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Section - Animada y Responsiva */}
      <div
        id="security"
        ref={(el) => {
          sectionRefs.current["security"] = el
        }}
        className={`container mx-auto px-6 py-20 transition-all duration-700 ${
          visibleSections.has("security") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Contenido */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 text-orange-600">
              <Shield className="w-8 h-8" />
              <span className="text-sm uppercase tracking-wider font-semibold">Seguridad</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              Protección de <span className="text-orange-600">Última Generación</span>
            </h3>
            <p className="text-neutral-400 leading-relaxed text-lg font-light">
              Contamos con sistemas de vigilancia 24/7, cámaras de alta definición, acceso controlado y personal
              capacitado para garantizar la seguridad de tu vehículo en todo momento. Nuestra tecnología incluye
              reconocimiento de placas, alertas en tiempo real y protocolos de emergencia certificados.
            </p>
          </div>
          
          {/* Imagen */}
          <div className="flex-1 w-full">
            <img
              src={persona}
              alt="Sistema de seguridad"
              className="w-full h-80 object-cover shadow-lg border-4 border-neutral-800"
            />
          </div>
        </div>
      </div>

      {/* Sustainability Section - Animada y Responsiva */}
      <div
        id="sustainability"
        ref={(el) => {
          sectionRefs.current["sustainability"] = el
        }}
        className={`container mx-auto px-6 py-20 transition-all duration-700 ${
          visibleSections.has("sustainability") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          
          {/* Contenido */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 text-orange-600">
              <Leaf className="w-8 h-8" />
              <span className="text-sm uppercase tracking-wider font-semibold">Sostenibilidad</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              Comprometidos con el <span className="text-orange-600">Futuro</span>
            </h3>
            <p className="text-neutral-400 leading-relaxed text-lg font-light">
              Implementamos prácticas sostenibles en todas nuestras operaciones: iluminación LED de bajo consumo,
              estaciones de carga para vehículos eléctricos, sistemas de recolección de agua y paneles solares. Nuestro
              compromiso es reducir la huella de carbono mientras ofrecemos un servicio de calidad.
            </p>
          </div>
          
          {/* Imagen */}
          <div className="flex-1 w-full">
            <img
              src={persona}
              alt="Estacionamiento sostenible"
              className="w-full h-80 object-cover shadow-lg border-4 border-neutral-800"
            />
          </div>
        </div>
      </div>
    </div>
  )
};

export default AboutView;