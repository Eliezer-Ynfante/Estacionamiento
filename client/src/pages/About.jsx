import { useState, useEffect, useRef } from "react"
import { Shield, Leaf, Users } from "lucide-react"
import persona from "@assets/image/p1.png" 

export function AboutView() {
  const [activeTab, setActiveTab] = useState("mision")
  const [visibleSections, setVisibleSections] = useState(new Set())
  const sectionRefs = useRef({})

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
        .font-sans {
            font-family: 'Montserrat', 'Open Sans', sans-serif !important;
        }
      `}</style>

      <div className="relative bg-black pt-32 pb-40 overflow-hidden"> 
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geometric-white" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="none" stroke="#ffffff" strokeWidth="1" />
                <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="8" fill="none" stroke="#ffffff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geometric-white)" />
          </svg>
        </div>
        
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

      <div className="container mx-auto px-6 -mt-20 pb-20 relative z-5">
        <div className="bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl shadow-orange-600/10">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-8 md:p-10 lg:p-10">
              <span className="text-orange-600 text-sm uppercase tracking-wider font-semibold">
                Sobre nosotros
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-8">
                Nuestros Lineamientos
              </h2>

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

              <div className="text-neutral-400 leading-relaxed text-lg font-light">
                {activeTab === "mision" ? (
                  <p className="animate-fade-in">
                    Nuestra misión es brindar soluciones integrales de estacionamiento que garanticen la seguridad,
                    comodidad y satisfacción de nuestros clientes.
                  </p>
                ) : (
                  <p className="animate-fade-in">
                    Ser la empresa líder en gestión de estacionamientos en el Perú.
                  </p>
                )}
              </div>

              <div className="mt-8 p-4 bg-neutral-800 border-l-4 border-orange-600">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-orange-600 shrink-0" />
                  <p className="text-sm text-neutral-300 font-semibold">
                    <span className="text-white">Experiencia:</span> Más de 15 años liderando la gestión de parqueos en Perú.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[300px] lg:min-h-auto">
              <img
                src={persona}
                alt="Estación de control de estacionamiento"
                loading="lazy"
                className="w-full h-[600px] object-cover lg:aspect-2/3"
              />
            </div>
          </div>
        </div>
      </div>

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
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 text-orange-600">
              <Shield className="w-8 h-8" />
              <span className="text-sm uppercase tracking-wider font-semibold">Seguridad</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              Protección de <span className="text-orange-600">Última Generación</span>
            </h3>
            <p className="text-neutral-400 leading-relaxed text-lg font-light">
              Contamos con sistemas de vigilancia 24/7 y acceso controlado.
            </p>
          </div>

          <div className="flex-1 w-full">
            <img
              src={persona}
              alt="Sistema de seguridad"
              loading="lazy"
              className="w-full h-80 object-cover shadow-lg border-4 border-neutral-800"
            />
          </div>
        </div>
      </div>

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
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 text-orange-600">
              <Leaf className="w-8 h-8" />
              <span className="text-sm uppercase tracking-wider font-semibold">Sostenibilidad</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              Comprometidos con el <span className="text-orange-600">Futuro</span>
            </h3>
            <p className="text-neutral-400 leading-relaxed text-lg font-light">
              Implementamos prácticas sostenibles en todas nuestras operaciones.
            </p>
          </div>

          <div className="flex-1 w-full">
            <img
              src={persona}
              alt="Estacionamiento sostenible"
              loading="lazy"
              className="w-full h-80 object-cover shadow-lg border-4 border-neutral-800"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutView
