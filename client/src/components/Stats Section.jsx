const statsData = [
  { value: "50+", label: "Espacios Disponibles" },
  { value: "100+", label: "Clientes Satisfechos" },
  { value: "24/7", label: "Servicio Continuo" },
  { value: "100%", label: "Seguro y Monitoreado" },
];

const Stats = () => {
  const marqueeItems = [...statsData, ...statsData];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap stats-marquee">
            {marqueeItems.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="text-center min-w-[200px]">
                <div className="font-montserrat font-bold text-5xl text-red-700 mb-2">
                  {stat.value}
                </div>

                <div className="font-open-sans text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes stats-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .stats-marquee {
          animation: stats-marquee 10s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Stats;
