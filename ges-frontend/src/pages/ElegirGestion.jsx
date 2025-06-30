import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animación de entrada
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const ElegirGestion = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState('');

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="min-h-screen bg-[#FCF7F8] flex flex-col items-center justify-center px-6 py-12">
      
      {/* Título */}
      <motion.div
        className="mb-6 text-center"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-[#A31621] font-[Poppins]">
          Selecciona el mes para generar tu informe
        </h1>
        <p className="text-gray-700 mt-2 text-sm sm:text-base">
          Elige el mes correspondiente para continuar con la generación del informe de cuentas.
        </p>
      </motion.div>

      {/* Selector de mes */}
      <motion.div
        className="mb-8 w-full max-w-md"
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="mes" className="block mb-2 text-sm font-medium text-gray-700">
          Mes del informe:
        </label>
        <select
          id="mes"
          name="mes"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A31621] focus:border-[#A31621] text-gray-700"
        >
          <option value="">Seleccione un mes</option>
          {meses.map((mes, index) => (
            <option key={index} value={mes}>
              {mes}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Botón continuar */}
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <Link
          to={mesSeleccionado ? `/generar-reportes?mes=${mesSeleccionado}` : '#'}
          className={`inline-block px-8 py-3 text-lg font-semibold text-white rounded-full shadow-lg transition-colors ${
            mesSeleccionado
              ? 'bg-[#A31621] hover:bg-[#CC998D]'
              : 'bg-gray-400 cursor-not-allowed pointer-events-none'
          }`}
          aria-label="Generar informe"
        >
          Realizar informe
        </Link>
      </motion.div>
    </div>
  );
};

export default ElegirGestion;
