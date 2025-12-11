import { CheckCircle } from "lucide-react";

const defaultPlans = [
  { name: "Básico", price: "S/ 5", period: "hora", features: ["Entrada y salida flexible", "Sin compromiso", "Ideal para visitas cortas"] },
  { name: "Ordinario", price: "S/ 60", period: "día", features: ["Estacionamiento 24 horas", "Espacio reservado garantizado", "Ahorra hasta 50%"], popular: true },
  { name: "Premium", price: "S/ 200", period: "semana", features: ["Máximo ahorro", "Espacio garantizado", "Servicio de lavado gratis"] },
];

const Pricing = ({
  title = "Planes y Tarifas",
  description = "Elige el plan que mejor se adapte a tus necesidades",
  plans = defaultPlans,
  ctaLabel = "Seleccionar Plan",
  onSelectPlan,
}) => {

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-4xl text-center mb-4 text-gray-800">
          {title}
        </h2>

        <p className="font-open-sans text-center text-gray-600 mb-12 text-lg">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 ${plan.popular
                  ? "bg-red-700 text-white shadow-2xl transform scale-105"
                  : "bg-gray-50 text-gray-800 shadow-lg"
                } hover:transform hover:scale-105 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-white text-red-700 px-4 py-1 rounded-full text-sm font-montserrat font-bold">
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
                    className="flex items-start gap-3 font-open-sans"
                  >
                    <CheckCircle
                      size={20}
                      className={plan.popular ? "text-white" : "text-red-700"}
                    />

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-montserrat font-semibold transition-colors duration-200 ${plan.popular
                    ? "bg-white text-red-700 hover:bg-gray-100"
                    : "bg-red-700 text-white hover:bg-red-800"
                  }`}
                onClick={() => onSelectPlan?.(plan, index)}
              >
                {plan.ctaLabel || ctaLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;