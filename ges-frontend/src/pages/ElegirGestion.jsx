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
  const [anioSeleccionado, setAnioSeleccionado] = useState('');

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const anios = ['2025', '2026', '2027', '2028'];

  const puedeContinuar = mesSeleccionado && anioSeleccionado;

  return (
    <div className="min-h-screen bg-[#FCF7F8] flex items-center justify-center px-6 py-12">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-lg"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Título */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#A31621] font-[Poppins]">
            Generar Informe
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Selecciona el mes y año para generar el informe de cuentas.
          </p>
        </div>

        {/* Selector de mes */}
        <div className="mb-6">
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
              <option key={index} value={mes}>{mes}</option>
            ))}
          </select>
        </div>

        {/* Selector de año */}
        <div className="mb-8">
          <label htmlFor="anio" className="block mb-2 text-sm font-medium text-gray-700">
            Año del informe:
          </label>
          <select
            id="anio"
            name="anio"
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A31621] focus:border-[#A31621] text-gray-700"
          >
            <option value="">Seleccione un año</option>
            {anios.map((anio, index) => (
              <option key={index} value={anio}>{anio}</option>
            ))}
          </select>
        </div>

        {/* Botón continuar */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            to={puedeContinuar ? `/generar-reportes?mes=${mesSeleccionado}&anio=${anioSeleccionado}` : '#'}
            className={`inline-block px-8 py-3 text-lg font-semibold text-white rounded-full shadow-md transition-all duration-300 ${
              puedeContinuar
                ? 'bg-[#A31621] hover:bg-[#8f131c] hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed pointer-events-none'
            }`}
            aria-label="Generar informe"
          >
            Realizar informe
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ElegirGestion;
