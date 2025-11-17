import React, { useState } from 'react';
import { CircleUserRound, Menu, X } from 'lucide-react';
import logo from '../assets/image/IntiPark.png';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#inicio');

  const navLinks = [
    { name: 'INICIO', href: '#inicio' },
    { name: 'RESERVAR', href: '#servicios' },
    { name: 'NOSOTROS', href: '#seguros' },
    { name: 'CONTACTO', href: '#contacto' },
  ];

  return (
    <nav className="bg-black w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex items-center justify-between h-20 relative">

          {/* LOGO */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer">
            <img src={logo} className="w-12 h-12" alt="IntiPark Logo" />
            <div className="leading-tight">
              <div className="text-xl font-bold text-gray-200">IntiPark</div>
              <div className="text-[11px] tracking-widest text-gray-300">
                Estacionamiento Seguro
              </div>
            </div>
          </div>

          {/* LINKS CENTRADOS (DESKTOP) */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={`text-sm font-light tracking-widest transition-colors duration-200 ${
                  activeLink === link.href
                    ? 'text-orange-500'
                    : 'text-gray-200 hover:text-orange-500'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* LOGIN (DESKTOP) */}
          <button className="hidden lg:flex items-center gap-2 text-gray-300 hover:text-orange-500 transition-colors duration-200">
            <CircleUserRound size={26} />
            <span className="text-sm font-light">INICIAR SESIÓN</span>
          </button>

          {/* BOTÓN HAMBURGUESA (MÓVIL) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-300 hover:text-orange-500 p-2 transition-colors"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800 w-full">
          <div className="px-6 py-4 space-y-4">

            {/* Links Mobile */}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.href);
                  setMenuOpen(false);
                }}
                className={`block text-base font-medium transition-colors duration-200 ${
                  activeLink === link.href
                    ? 'text-orange-500'
                    : 'text-gray-300 hover:text-orange-500'
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* LOGIN MOBILE */}
            <button className="flex items-center gap-3 text-gray-300 hover:text-orange-500 transition-colors pt-4">
              <CircleUserRound size={28} />
              <span className="text-base font-medium">INICIAR SESIÓN</span>
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}
