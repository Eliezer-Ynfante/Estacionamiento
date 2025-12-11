import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CircleUserRound, Menu, X } from 'lucide-react';
import logo from '../assets/image/IntiPark.png';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'INICIO', path: '/', type: 'route' },
    { name: 'RESERVAR', path: '/reservar', type: 'route' },
    { name: 'NOSOTROS', path: '/nosotros', type: 'route' },
    { name: 'CONTACTO', path: '/contacto', type: 'route' },
  ];

  // Función para determinar si un link está activo
  const isActive = (link) => {
    if (link.type === 'route') {
      return location.pathname === link.path;
    } else {
      // Para anclas, verificar si estamos en la página de inicio y el hash coincide
      return location.pathname === '/' && location.hash === link.href;
    }
  };

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Función para manejar clicks en anclas
  const handleAnchorClick = (href, e) => {
    // Si no estamos en la página de inicio, navegar primero
    if (location.pathname !== '/') {
      e.preventDefault();
      // Navegar a inicio y luego al ancla
      window.location.href = `/${href}`;
    } else {
      // Scroll suave al ancla
      const element = document.querySelector(href);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMenuOpen(false);
  };

  return (
    <nav className="bg-black w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex items-center justify-between h-20 relative">

          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0 cursor-pointer">
            <img src={logo} className="w-12 h-12" alt="IntiPark Logo" />
            <div className="leading-tight">
              <div className="text-xl font-bold text-gray-200">IntiPark</div>
              <div className="text-[11px] tracking-widest text-gray-300">
                Estacionamiento Seguro
              </div>
            </div>
          </NavLink>

          {/* LINKS CENTRADOS (DESKTOP) */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-10">
            {navLinks.map((link) => {
              if (link.type === 'route') {
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-sm font-light tracking-widest transition-colors duration-200 ${
                        isActive
                          ? 'text-orange-500'
                          : 'text-gray-200 hover:text-orange-500'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                );
              } else {
                const active = isActive(link);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(link.href, e)}
                    className={`text-sm font-light tracking-widest transition-colors duration-200 ${
                      active
                        ? 'text-orange-500'
                        : 'text-gray-200 hover:text-orange-500'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              }
            })}
          </div>


          {/* LOGIN (DESKTOP) */}
          <button className="hidden lg:flex items-center gap-2 text-gray-300 hover:text-orange-700 transition-colors duration-200">
            <CircleUserRound size={26} />
            <span className="text-sm font-light">INICIAR SESIÓN</span>
          </button>

          {/* BOTÓN HAMBURGUESA (MÓVIL) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gray-300 hover:text-orange-700 p-2 transition-colors"
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
            {navLinks.map((link) => {
              const active = isActive(link);
              const linkClassName = `block text-base font-medium transition-colors duration-200 ${
                active
                  ? 'text-orange-500'
                  : 'text-gray-300 hover:text-orange-500'
              }`;

              if (link.type === 'route') {
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block text-base font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-orange-500'
                          : 'text-gray-300 hover:text-orange-500'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                );
              } else {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(link.href, e)}
                    className={linkClassName}
                  >
                    {link.name}
                  </a>
                );
              }
            })}

            {/* LOGIN MOBILE */}
            <button className="flex items-center gap-3 text-gray-300 hover:text-orange-700 transition-colors pt-4">
              <CircleUserRound size={28} />
              <span className="text-base font-medium">INICIAR SESIÓN</span>
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}
