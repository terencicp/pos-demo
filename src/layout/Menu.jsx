import { useState } from 'react';
import MenuItem from './MenuItem';
import { Menu as MenuIcon, X } from 'lucide-react'; // Using lucide-react icons

export default function Menu({ width }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Hamburger button - visible only on small screens and when menu is closed */}
      {!isMobileMenuOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-30 p-2 bg-gray-200 rounded-md"
          onClick={toggleMobileMenu}
          aria-label="Open menu"
        >
          <MenuIcon size={24} />
        </button>
      )}

      {/* Overlay for mobile menu - shown when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Original menu background - hidden on small screens, part of the static layout on larger screens */}
      <div className={`hidden md:block ${width} bg-gray-50 fixed top-0 bottom-0 left-0`}>
        {/* Menu background */}
      </div>

      {/* Menu content */}
      <aside
        className={`
          ${width} p-4 pt-6 fixed top-0 bottom-0 left-0 z-20 bg-gray-50
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          transition-transform duration-300 ease-in-out
          md:relative md:bg-transparent md:z-10
        `}
      >
        <div className="flex justify-between items-center md:block">
          <h1 className="text-2xl font-bold my-1 ml-4 md:mb-4 text-blue-800">
            VENTAS
          </h1>
          {/* Close button - visible only on small screens when menu is open */}
          <button
            className="md:hidden p-2"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-grow mt-4 md:mt-0">
          <ul>
            <MenuItem to="/pedido" onClick={toggleMobileMenu}>Pedido</MenuItem>
            <MenuItem to="/presupuesto" onClick={toggleMobileMenu}>Presupuesto</MenuItem>
            <MenuItem to="/documentos" onClick={toggleMobileMenu}>Documentos</MenuItem>
          </ul>
        </nav>
      </aside>
    </>
  );
}
