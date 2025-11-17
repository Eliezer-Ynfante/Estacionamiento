const Stats = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-montserrat font-bold text-5xl text-red-700 mb-2">
              500+
            </div>

            <div className="font-open-sans text-gray-600">
              Espacios Disponibles
            </div>
          </div>

          <div>
            <div className="font-montserrat font-bold text-5xl text-red-700 mb-2">
              10K+
            </div>

            <div className="font-open-sans text-gray-600">
              Clientes Satisfechos
            </div>
          </div>

          <div>
            <div className="font-montserrat font-bold text-5xl text-red-700 mb-2">
              24/7
            </div>

            <div className="font-open-sans text-gray-600">
              Servicio Continuo
            </div>
          </div>

          <div>
            <div className="font-montserrat font-bold text-5xl text-red-700 mb-2">
              100%
            </div>

            <div className="font-open-sans text-gray-600">
              Seguro y Monitoreado
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
