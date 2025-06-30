import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const links = [
  { name: 'Inicio', href: '#' },
  { name: 'Generar reporte', href: '#' },
  { name: 'Ver información', href: '#' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#A31621] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-[#FCF7F8]">Mar del Plata</div>

        {/* Desktop */}
        <ul className="hidden md:flex space-x-8">
          {links.map(link => (
            <li key={link.name}>
              <a href={link.href} className="text-[#FCF7F8] hover:text-[#CC998D] font-medium transition">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden md:hidden bg-white px-4"
          >
            {links.map(link => (
              <li key={link.name} className="py-2 border-b">
                <a href={link.href} className="text-gray-700 block hover:text-blue-500 font-medium transition">
                  {link.name}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
