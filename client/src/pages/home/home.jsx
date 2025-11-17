import { ArrowRight } from "lucide-react";
import Carousel from "../../components/Carrucel";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-black text-white w-full py-4 lg:min-h-[700px] flex items-center">
        <div className="container mx-auto px-6 md:px-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Texto Izquierdo */}
            <div>
              <h1 className="font-montserrat font-bold text-4xl md:text-6xl lg:text-8xl mb-2 leading-tight">
                IntiPark
              </h1>

              <h2 className="font-montserrat font-bold text-2xl md:text-4xl lg:text-5xl mb-6 text-gray-200 leading-tight">
                Estacionamiento seguro
              </h2>

              <p className="font-open-sans text-base md:text-lg lg:text-xl mb-8 text-gray-100 max-w-md">
                Mantén tu vehículo protegido con la tecnología de seguridad más
                avanzada del mercado. Vigilancia 24/7, monitoreo inteligente y
                sistemas de alta precisión que cuidan tu auto incluso cuando tú
                no estás. Porque tu tranquilidad no tiene precio.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-orange-600 text-white font-montserrat font-semibold px-6 py-3 md:px-8 md:py-3 hover:bg-orange-500 transition-colors duration-200 flex items-center gap-2">
                  Reservar Ahora
                  <ArrowRight size={20} />
                </button>

                <button className="border-2 border-white text-white font-montserrat font-semibold px-6 py-3 md:px-8 md:py-3 hover:bg-white hover:text-black transition-colors duration-200">
                  Ver Tarifas
                </button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end items-center">
              <Carousel />
            </div>

          </div>

        </div>
      </section>

      {/* Segunda sección (en blanco por ahora) */}
      <section className="bg-gray-100 text-black min-h-[400px] flex items-center">
        <div className="container mx-auto px-6 md:px-10">
        </div>
      </section>
    </div>
  );
};

export default Home;
