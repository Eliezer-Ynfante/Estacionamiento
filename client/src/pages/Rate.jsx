import { CheckCircle, Loader, Car, Bike, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { obtenerTodasTarifas } from "@api/tarifas";
import { obtenerTiposVehiculos } from "@api/vehiculos";

const vehicleIcons = {
  Auto: Car,
  Moto: Bike,
  Camión: Truck,
};

const Tarifas = ({
  title = "Planes y Tarifas",
  description = "Elige el plan que mejor se adapte a tus necesidades",
  ctaLabel = "Seleccionar Plan",
  onSelectPlan = () => {},
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [tarifas, setTarifas] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener tipos de vehículos
      const respTipos = await obtenerTiposVehiculos();
      const tipos = respTipos.data || respTipos;
      setVehicleTypes(tipos);
      
      // Establecer primer tipo como seleccionado
      if (tipos.length > 0) {
        setSelectedVehicle(tipos[0].id);
      }

      // Obtener tarifas
      const respTarifas = await obtenerTodasTarifas();
      const datos = respTarifas.data || respTarifas;
      setTarifas(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar las tarifas y tipos de vehículos");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar tarifas según el tipo de vehículo seleccionado
  const tarifasFiltradasPorVehiculo = selectedVehicle
    ? tarifas.filter(tarifa => tarifa.tipo_vehiculo_id === selectedVehicle)
    : [];

  // Construir planes con cada período en una tarjeta separada
  const construirPlanes = () => {
    if (tarifasFiltradasPorVehiculo.length === 0) return [];

    const plans = [];

    tarifasFiltradasPorVehiculo.forEach((tarifa, index) => {
      const tipoVehiculo = vehicleTypes.find(v => v.id === tarifa.tipo_vehiculo_id);

      const periods = [
        { 
          label: "Por Hora", 
          price: `S/ ${parseFloat(tarifa.precio_hora).toFixed(2)}`,
          key: "precio_hora"
        },
        { 
          label: "Por Día", 
          price: `S/ ${parseFloat(tarifa.precio_dia).toFixed(2)}`,
          key: "precio_dia"
        },
        { 
          label: "Por Semana", 
          price: `S/ ${parseFloat(tarifa.precio_semana).toFixed(2)}`,
          key: "precio_semana"
        },
      ];

      periods.forEach((period, periodIndex) => {
        plans.push({
          id: `${tarifa.id}-${period.key}`,
          name: tipoVehiculo?.nombre || `Plan ${index + 1}`,
          period: period.label,
          price: period.price,
          tarifa: tarifa,
          periodKey: period.key,
          popular: index === 0 && periodIndex === 1,
        });
      });
    });

    return plans;
  };

  const currentPlans = construirPlanes();

  if (error) {
    return (
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white font-montserrat text-lg mb-4">{error}</p>
          <button
            onClick={cargarDatos}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-montserrat font-semibold hover:bg-orange-500 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
            <span className="text-orange-600">{title.split(' ')[0]}</span> {title.split(' ').slice(1).join(' ')}
          </h1>
          <p className="text-neutral-400 text-base max-w-2xl mx-auto font-light">
            {description}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size={40} className="animate-spin text-white" />
          </div>
        ) : (
          <>
            {/* Filtros de Vehículos */}
            <div className="flex justify-center gap-3 mb-12 flex-wrap">
              {vehicleTypes.map((vehicle) => {
                const Icon = vehicleIcons[vehicle.nombre] || Car;
                return (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 border-b-2 ${
                      selectedVehicle === vehicle.id
                        ? "text-orange-600 border-orange-600"
                        : "text-neutral-400 border-transparent hover:border-neutral-600"
                    }`}
                  >
                    <Icon size={18} />
                    {vehicle.nombre}
                  </button>
                );
              })}
            </div>

            {/* Planes de Precios */}
            {currentPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white font-open-sans">No hay tarifas disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {currentPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-8 border transition-all duration-300 ${
                      plan.popular
                        ? "bg-neutral-900 border-orange-600 shadow-lg shadow-orange-600/10"
                        : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    {plan.popular && (
                      <div className="text-center mb-4">
                        <span className="text-orange-600 text-xs uppercase tracking-wider font-semibold">
                          Más Popular
                        </span>
                      </div>
                    )}

                    <h3 className="font-semibold text-lg mb-2 text-white text-center">
                      {plan.name}
                    </h3>

                    <p className="text-neutral-400 text-sm text-center mb-6 font-light">
                      {plan.period}
                    </p>

                    <div className="text-center mb-6 border-b border-neutral-800 pb-6">
                      <span className="text-4xl font-bold text-orange-600">
                        {plan.price}
                      </span>
                    </div>

                    <ul className="space-y-2 mb-8">
                      <li className="flex items-start gap-3 text-sm text-neutral-300">
                        <CheckCircle
                          size={16}
                          className="text-orange-600 shrink-0 mt-0.5"
                        />
                        <span>Tarifa {plan.period.toLowerCase()}</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-neutral-300">
                        <CheckCircle
                          size={16}
                          className="text-orange-600 shrink-0 mt-0.5"
                        />
                        <span>Acceso 24/7</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-neutral-300">
                        <CheckCircle
                          size={16}
                          className="text-orange-600 shrink-0 mt-0.5"
                        />
                        <span>Soporte al cliente</span>
                      </li>
                    </ul>

                    <button
                      className={`w-full py-3 rounded font-semibold text-sm transition-all duration-300 uppercase tracking-wider ${
                        plan.popular
                          ? "bg-orange-600 text-white hover:bg-orange-700"
                          : "border border-neutral-700 text-white hover:border-orange-600 hover:text-orange-600"
                      }`}
                      onClick={() => 
                        onSelectPlan?.(plan, { 
                          vehicle: selectedVehicle,
                          period: plan.periodKey,
                          tarifaId: plan.tarifa.id
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
              <p className="text-neutral-400 text-sm">
                Vehículo Seleccionado: <span className="text-white font-semibold">
                  {vehicleTypes.find((v) => v.id === selectedVehicle)?.nombre}
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