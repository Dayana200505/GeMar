import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import CurrentReadingModal from '../components/CurrentReadingModal';
import ReadingInputModal from '../components/ReadingInputModal';

const departments = [
  'PB-A', 'PB-B', '1-A', '1-B', '2-A', '2-B', '3-A', '3-B',
  '4-A', '4-B', '5-A', '5-B', '6-A', '6-B',
];

const PREVIOUS_READING = 10.02;

const GenerarReportes = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [readingInputs, setReadingInputs] = useState({
    lectura1: '',
    lectura2: '',
    total: null,
  });
  const [totalReading, setTotalReading] = useState(null);
  const [currentReadings, setCurrentReadings] = useState({});
  const [currentDeptIndex, setCurrentDeptIndex] = useState(0);
  const [showReadingModal, setShowReadingModal] = useState(true);
  const [showCurrentModal, setShowCurrentModal] = useState(false);

  const consumptionData = departments.map(dept => {
    const current = parseFloat(currentReadings[dept]) || 0;
    const consumption = current ? (current - PREVIOUS_READING).toFixed(2) : '';
    return { dept, current, consumption };
  });

  const totalConsumption = consumptionData
    .reduce((sum, data) => sum + (parseFloat(data.consumption) || 0), 0)
    .toFixed(2);

  const unitPrice = totalReading && totalConsumption
    ? (parseFloat(totalReading) / parseFloat(totalConsumption)).toFixed(2)
    : 0;

  const getPeriodo = (fecha) => {
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", 
                   "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const d = new Date(fecha);
    if (isNaN(d)) return '';
    const mes2 = meses[d.getMonth()];
    const mes1 = meses[d.getMonth() - 1] || meses[11];
    return `${mes1.charAt(0).toUpperCase() + mes1.slice(1)}-${mes2.charAt(0).toUpperCase() + mes2.slice(1)}`;
  };

  const formatFecha = (fecha) => {
    const d = new Date(fecha);
    if (isNaN(d)) return '';
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const año = d.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const handleReadingSubmit = (lectura1, lectura2) => {
    const l1 = parseFloat(lectura1) || 0;
    const l2 = parseFloat(lectura2) || 0;
    const total = (l1 + l2).toFixed(2);
    setReadingInputs({ lectura1: l1.toFixed(2), lectura2: l2.toFixed(2), total });
    setTotalReading(total);
    setShowReadingModal(false);
    setShowCurrentModal(true);
  };


  const handleCurrentReadingSubmit = (reading) => {
    setCurrentReadings(prev => ({
      ...prev,
      [departments[currentDeptIndex]]: reading,
    }));
  
    // Avanza al siguiente automáticamente
    if (currentDeptIndex < departments.length - 1) {
      setCurrentDeptIndex(prev => prev + 1);
    } else {
      setShowCurrentModal(false); // último departamento
    }
  };
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10 md:p-20">
      <ReadingInputModal
        isOpen={showReadingModal}
        onClose={() => setShowReadingModal(false)}
        onSubmit={handleReadingSubmit}
      />
      
      <CurrentReadingModal
        isOpen={showCurrentModal}
        onClose={() => setShowCurrentModal(false)}
        onSubmit={handleCurrentReadingSubmit}
        department={departments[currentDeptIndex]}
      />

      <motion.div
        className="flex items-center justify-center mb-8"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-[#A31621] font-[Poppins] text-center">
          Informe del Mes: {getPeriodo(selectedDate)}
        </h1>
      </motion.div>

      <div className="mb-6 bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2 text-[#162c3b]">Lecturas Ingresadas</h2>
        <p>Lectura 1: <span className="font-medium">{readingInputs.lectura1 || '--'}</span></p>
        <p>Lectura 2: <span className="font-medium">{readingInputs.lectura2 || '--'}</span></p>
        <p>Total: <span className="font-medium">{readingInputs.total || '--'}</span></p>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-[#162c3b] text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">FECHA</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">DPTO</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">ACTUAL</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">ANTERIOR</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">CONSUMO</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">PRECIO CUBO</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">TOTAL Bs</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">TOTAL Bs (Redondeado)</th>
            </tr>
          </thead>
          <tbody>
            {consumptionData.map((data, index) => {
              const totalBs = data.consumption ? (parseFloat(data.consumption) * unitPrice).toFixed(2) : '';
              const roundedTotal = totalBs ? Math.round(totalBs) : '';

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {formatFecha(selectedDate)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 font-medium">
                    {data.dept}
                  </td>
                  <td
                  className="border border-gray-300 px-4 py-2 text-gray-800 cursor-pointer hover:underline"
                  onClick={() => {
                    setCurrentDeptIndex(index);
                    setShowCurrentModal(true);
                  }}
                >
                  {data.current !== '' && data.current !== undefined
                    ? parseFloat(data.current).toFixed(2)
                    : ''}
                </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {PREVIOUS_READING}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {data.consumption}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {unitPrice}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {totalBs}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">
                    {roundedTotal}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-gray-100 font-bold">
              <td colSpan="4" className="border border-gray-300 px-4 py-2 text-right">Total:</td>
              <td className="border border-gray-300 px-4 py-2">{totalConsumption}</td>
              <td className="border border-gray-300 px-4 py-2"></td>
              <td className="border border-gray-300 px-4 py-2">
                {consumptionData.reduce((sum, data) => sum + (parseFloat(data.consumption) * unitPrice || 0), 0).toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {consumptionData.reduce((sum, data) => {
                  const totalBs = parseFloat(data.consumption) * unitPrice || 0;
                  return sum + (totalBs ? Math.round(totalBs) : 0);
                }, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenerarReportes;
