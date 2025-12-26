import { CheckCircle, Loader, Car, Bike, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { obtenerTarifas } from "../../api/tarifas";

const vehicleTypes = [
  { id: "auto", label: "Auto", icon: Car },
  { id: "moto", label: "Moto", icon: Bike },
  { id: "camion", label: "Camión", icon: Truck },
];

const periods = [
  { id: "hora", label: "Por Hora" },
  { id: "dia", label: "Por Día" },
  { id: "semana", label: "Por Semana" },
];

const Tarifas = ({
  title = "Planes y Tarifas",
  description = "Elige el plan que mejor se adapte a tus necesidades",
  ctaLabel = "Seleccionar Plan",
  onSelectPlan = () => {},
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState("auto");
  const [selectedPeriod, setSelectedPeriod] = useState("dia");
  const [tarifas, setTarifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarTarifas();
  }, []);

  const cargarTarifas = async () => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerTarifas();
      setTarifas(datos);
    } catch (error) {
      console.error("Error al cargar tarifas:", error);
      setError("Error al cargar las tarifas");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar tarifas según el tipo de vehículo
  const tarrifasFiltradasPorVehiculo = tarifas.filter(tarifa => {
    const nombre = tarifa.nombre.toLowerCase();
    return nombre.includes(selectedVehicle.toLowerCase());
  });

  // Construir planes según el período
  const construirPlanes = () => {
    if (tarrifasFiltradasPorVehiculo.length === 0) return [];

    return tarrifasFiltradasPorVehiculo.map((tarifa, index) => {
      const precioMap = {
        hora: tarifa.precio_hora,
        dia: tarifa.precio_dia,
        semana: tarifa.precio_semana,
      };

      const features = tarifa.descripcion 
        ? tarifa.descripcion.split(",").map(f => f.trim()).filter(f => f)
        : ["Plan disponible"];

      return {
        name: tarifa.nombre,
        price: `S/ ${parseFloat(precioMap[selectedPeriod]).toFixed(2)}`,
        period: selectedPeriod,
        features,
        popular: index === 1 && tarrifasFiltradasPorVehiculo.length >= 2,
      };
    });
  };

  const currentPlans = construirPlanes();

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 font-montserrat text-lg mb-4">{error}</p>
          <button
            onClick={cargarTarifas}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-montserrat font-semibold hover:bg-orange-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-4xl text-center mb-4 text-gray-800">
          {title}
        </h2>

        <p className="font-open-sans text-center text-gray-600 mb-12 text-lg">
          {description}
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size={40} className="animate-spin text-orange-600" />
          </div>
        ) : (
          <>
            {/* Filtros de Período */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-6 py-3 rounded-full font-montserrat font-semibold transition-all duration-300 ${
                    selectedPeriod === period.id
                      ? "bg-orange-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-700"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            {/* Filtros de Vehículos */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              {vehicleTypes.map((vehicle) => {
                const Icon = vehicle.icon;
                return (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-montserrat font-semibold transition-all duration-300 ${
                      selectedVehicle === vehicle.id
                        ? "bg-orange-600 text-white shadow-lg"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-600"
                    }`}
                  >
                    <Icon size={20} />
                    {vehicle.label}
                  </button>
                );
              })}
            </div>

            {/* Planes de Precios */}
            {currentPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 font-open-sans">No hay tarifas disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {currentPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-8 transition-all duration-300 ${
                      plan.popular
                        ? "bg-orange-600 text-white shadow-2xl transform scale-105"
                        : "bg-white text-gray-800 shadow-lg border border-gray-200 hover:shadow-xl"
                    } hover:transform hover:scale-105`}
                  >
                    {plan.popular && (
                      <div className="text-center mb-4">
                        <span className="bg-white text-orange-600 px-4 py-1 rounded-full text-sm font-montserrat font-bold">
                          MÁS POPULAR
                        </span>
                      </div>
                    )}

                    <h3 className="font-montserrat font-bold text-2xl mb-4 text-center">
                      {plan.name}
                    </h3>

                    <div className="text-center mb-6">
                      <span className="font-montserrat font-bold text-5xl">
                        {plan.price}
                      </span>
                      <span className={`font-open-sans text-lg block ${
                        plan.popular ? "text-white" : "text-gray-600"
                      }`}>
                        /{plan.period}
                      </span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 font-open-sans text-sm"
                        >
                          <CheckCircle
                            size={20}
                            className={`${
                              plan.popular ? "text-white" : "text-orange-600"
                            } flex-shrink-0 mt-0.5`}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-3 rounded-lg font-montserrat font-semibold transition-colors duration-200 ${
                        plan.popular
                          ? "bg-white text-orange-600 hover:bg-gray-100"
                          : "bg-orange-600 text-white hover:bg-orange-700"
                      }`}
                      onClick={() => 
                        onSelectPlan?.(plan, { 
                          period: selectedPeriod,
                          vehicle: selectedVehicle,
                          tarifaId: index 
                        })
                      }
                    >
                      {ctaLabel}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Resumen de selección */}
            <div className="mt-12 text-center">
              <p className="font-open-sans text-gray-600">
                Vehículo seleccionado: <span className="font-semibold text-orange-500">
                  {vehicleTypes.find((v) => v.id === selectedVehicle)?.label}
                </span> • Período: <span className="font-semibold text-orange-600">
                  {periods.find((p) => p.id === selectedPeriod)?.label}
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Tarifas;