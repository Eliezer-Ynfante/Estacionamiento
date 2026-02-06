import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Logo y Descripción */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <div className="font-montserrat font-bold text-2xl text-white">IntiPark</div>
              <div className="font-open-sans text-xs mb-2 text-gray-100 tracking-widest">Estacionamiento Seguro</div>
            </div>
            <p className="font-open-sans text-gray-300 text-sm">
              Tu estacionamiento de confianza con la mejor seguridad y servicio las 24 horas.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="font-montserrat font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 font-open-sans text-gray-200 text-sm">
              <li><a href="#inicio" className="hover:text-red-700 transition-colors">Inicio</a></li>
              <li><a href="#servicios" className="hover:text-red-700 transition-colors">Servicios</a></li>
              <li><a href="#tarifas" className="hover:text-red-700 transition-colors">Tarifas</a></li>
              <li><a href="#contacto" className="hover:text-red-700 transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="font-montserrat font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3 font-open-sans text-gray-200 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={18} className="text-red-700" />
                <span>Av. Principal 123, Lima</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-red-700" />
                <span>+51 999 888 777</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-red-700" />
                <span>info@serviauto.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={18} className="text-red-700" />
                <span>24/7 Disponible</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h3 className="font-montserrat font-bold text-lg mb-4">Siguenos</h3>
            <ul className="space-y-2 font-open-sans font-bold text-gray-300 text-sm">
              <li><a href="#inicio" className="hover:text-red-700 transition-colors">Facebook</a></li>
              <li><a href="#tarifas" className="hover:text-red-700 transition-colors">LinkedIn</a></li>
              <li><a href="#contacto" className="hover:text-red-700 transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-open-sans text-gray-400 text-sm">
              © 2025 IntiPark. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 font-open-sans text-gray-400 text-sm">
              <a href="#" className="hover:text-red-700 transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-red-700 transition-colors">Términos y Condiciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;