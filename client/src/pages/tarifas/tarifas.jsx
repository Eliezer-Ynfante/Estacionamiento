import { CheckCircle, Car, Bike, Truck } from "lucide-react";
import { useState } from "react";

const pricingData = {
  hora: {
    auto: [
      { name: "Básico", price: "S/ 5", period: "hora", features: ["Entrada y salida flexible", "Sin compromiso", "Ideal para visitas cortas"] },
      { name: "Premium", price: "S/ 7", period: "hora", features: ["Prioridad de acceso", "Espacio cubierto", "Seguro incluido"] },
    ],
    moto: [
      { name: "Básico", price: "S/ 2", period: "hora", features: ["Estacionamiento seguro", "Sin compromiso", "Rápido acceso"] },
      { name: "Premium", price: "S/ 3.50", period: "hora", features: ["Zona vigilada 24/7", "Seguro incluido", "Carga de batería gratis"] },
    ],
    camion: [
      { name: "Básico", price: "S/ 15", period: "hora", features: ["Acceso amplio", "Espacio grande", "Puertas automáticas"] },
      { name: "Premium", price: "S/ 20", period: "hora", features: ["Zona de carga", "Vigilancia completa", "Asesor disponible"] },
    ],
  },
  dia: {
    auto: [
      { name: "Básico", price: "S/ 30", period: "día", features: ["Estacionamiento 24 horas", "Sin compromiso", "Espacio reservado"] },
      { name: "Ordinario", price: "S/ 60", period: "día", features: ["Estacionamiento 24 horas", "Espacio reservado garantizado", "Ahorra hasta 50%"], popular: true },
      { name: "Premium", price: "S/ 80", period: "día", features: ["Área VIP", "Lavado gratis", "Servicio de portería"] },
    ],
    moto: [
      { name: "Básico", price: "S/ 12", period: "día", features: ["Zona segura", "Sin compromiso", "Inspección visual"] },
      { name: "Ordinario", price: "S/ 25", period: "día", features: ["Vigilancia 24/7", "Carga de batería", "Cobertura de seguro"], popular: true },
      { name: "Premium", price: "S/ 35", period: "día", features: ["Zona VIP", "Mantenimiento básico", "Transporte de casco"] },
    ],
    camion: [
      { name: "Básico", price: "S/ 80", period: "día", features: ["Zona amplia", "Sin restricciones", "Acceso 24/7"] },
      { name: "Ordinario", price: "S/ 150", period: "día", features: ["Zona de carga", "Vigilancia completa", "Asesor disponible"], popular: true },
      { name: "Premium", price: "S/ 220", period: "día", features: ["Zona VIP con grúa", "Seguro completo", "Soporte logístico"] },
    ],
  },
  semana: {
    auto: [
      { name: "Básico", price: "S/ 150", period: "semana", features: ["7 días de acceso", "Espacio garantizado", "Sin servicios adicionales"] },
      { name: "Ordinario", price: "S/ 280", period: "semana", features: ["7 días acceso", "Espacio preferente", "Descuento en servicios"], popular: true },
      { name: "Premium", price: "S/ 400", period: "semana", features: ["Máximo ahorro", "Espacio garantizado", "Servicio de lavado gratis"] },
    ],
    moto: [
      { name: "Básico", price: "S/ 60", period: "semana", features: ["7 días seguro", "Zona vigilada", "Sin servicios"] },
      { name: "Ordinario", price: "S/ 120", period: "semana", features: ["7 días protección", "Carga gratis", "Mantenimiento básico"], popular: true },
      { name: "Premium", price: "S/ 160", period: "semana", features: ["Protección total", "Servicio premium", "Transporte de piezas"] },
    ],
    camion: [
      { name: "Básico", price: "S/ 400", period: "semana", features: ["7 días acceso", "Zona amplia", "Acceso 24/7"] },
      { name: "Ordinario", price: "S/ 700", period: "semana", features: ["7 días zona premium", "Vigilancia 24/7", "Soporte técnico"], popular: true },
      { name: "Premium", price: "S/ 1000", period: "semana", features: ["Zona VIP", "Seguro completo", "Logística incluida"] },
    ],
  },
};

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
  description = "Elige el plan que mejor se adapte a tus necesidades y tipo de vehículo",
  ctaLabel = "Seleccionar Plan",
  onSelectPlan = () => {},
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState("auto");
  const [selectedPeriod, setSelectedPeriod] = useState("dia");

  const currentPlans = pricingData[selectedPeriod][selectedVehicle];

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-4xl text-center mb-4 text-gray-800">
          {title}
        </h2>

        <p className="font-open-sans text-center text-gray-600 mb-12 text-lg">
          {description}
        </p>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {currentPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 ${
                plan.popular
                  ? "bg-orange-600 text-white shadow-2xl transform scale-105"
                  : "bg-white text-gray-800 shadow-lg border border-gray-200"
              } hover:transform hover:scale-105 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-white text-orange-700 px-4 py-1 rounded-full text-sm font-montserrat font-bold">
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
                <span className="font-open-sans text-lg">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 font-open-sans text-sm"
                  >
                    <CheckCircle
                      size={20}
                      className={plan.popular ? "text-white flex-shrink-0" : "text-orange-700 flex-shrink-0"}
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
                onClick={() => onSelectPlan?.(plan, { vehicle: selectedVehicle, period: selectedPeriod })}
              >
                {ctaLabel}
              </button>
            </div>
          ))}
        </div>

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
      </div>
    </section>
  );
};

export default Tarifas;