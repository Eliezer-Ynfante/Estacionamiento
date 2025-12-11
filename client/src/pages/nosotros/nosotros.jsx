import { ArrowRight } from "lucide-react";
import personal from "../../assets/image/p1.png";
import LoadingButton from "../../components/LoadingButton";

const Nosotros = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white w-full lg:min-h-[700px] flex items-center">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto Izquierdo */}
            <div>
              <h1 className="font-montserrat font-bold text-2xl md:text-2xl lg:text-3xl mb-2 leading-tight">
                IntiPark
              </h1>

              <p className="font-open-sans text-base md:text-lg lg:text-xl mb-8 text-gray-100 max-w-md">
                Mantén tu vehículo protegido con la tecnología de seguridad más
                avanzada del mercado. Vigilancia 24/7, monitoreo inteligente y
                sistemas de alta precisión que cuidan tu auto incluso cuando tú
                no estás. Porque tu tranquilidad no tiene precio.
              </p>

              <div className="flex flex-wrap gap-4">
                <LoadingButton
                  href="/reservar"
                  className="bg-orange-600 text-white font-montserrat font-semibold px-6 py-3 md:px-8 md:py-3 hover:bg-orange-500 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                  loadingText="Redirigiendo"
                  icon={<ArrowRight size={20} />}
                >
                  Reservar Ahora
                </LoadingButton>

                <LoadingButton
                  href="/tarifas"
                  className="border-2 border-white text-white font-montserrat font-semibold px-6 py-3 md:px-8 md:py-3 hover:bg-white hover:text-black transition-colors duration-200 flex items-center justify-center"
                >
                  Ver Tarifas
                </LoadingButton>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end items-center">
              {/* <Carousel /> */}
              <img
                src={personal}
                alt="personal"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;
