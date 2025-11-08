import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import readingService from '../services/readingService';

import CurrentReadingModal from '../components/CurrentReadingModal';
import ReadingInputModal from '../components/ReadingInputModal';
import SaveSuccessModal from '../components/SaveSuccessModal';
import PreviousReadingModal from '../components/PreviousReadingModal';


const DEPARTMENTS = [
  'PB-A', 'PB-B', '1-A', '1-B', '2-A', '2-B', '3-A', '3-B',
  '4-A', '4-B', '5-A', '5-B', '6-A', '6-B', 'GENERAL',
];
const MODAL_TIMEOUT = 2000;
const TEMPLATE_PATH = 'plantillas/PlantillaGeMar.xlsx';

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const GenerarReportes = () => {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [previousReadings, setPreviousReadings] = useState({});
  const [readingInputs, setReadingInputs] = useState({ lectura1: '', lectura2: '', total: null });
  const [totalReading, setTotalReading] = useState(null);
  const [currentReadings, setCurrentReadings] = useState({});
  const [currentDeptIndex, setCurrentDeptIndex] = useState(0);
  const [showPreviousReadingModal, setShowPreviousReadingModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [showCurrentModal, setShowCurrentModal] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedReadingId, setSavedReadingId] = useState(null);

  // Cargar lectura anterior automáticamente cuando se selecciona un departamento
  useEffect(() => {
    if (selectedDepartment) {
      loadPreviousReading(selectedDepartment);
    }
  }, [selectedDepartment]);

  // Función para cargar lectura anterior desde la BD
  const loadPreviousReading = async (department) => {
    try {
      const response = await readingService.getPreviousReading(department);
      if (response.success) {
        setPreviousReadings(prev => ({ 
          ...prev, 
          [department]: response.data.previous_reading 
        }));
      }
    } catch (error) {
      console.log('No hay lectura anterior para este departamento');
    }
  };

  // Derived data
  const consumptionData = DEPARTMENTS.map(dept => {
    const current = parseFloat(currentReadings[dept]) || 0;
    const previous = parseFloat(previousReadings[dept]) || 0;
    const consumption = current && previousReadings[dept] ? (current - previous).toFixed(2) : '';
    return { dept, current, previous, consumption };
  });

  const totalConsumption = consumptionData
    .reduce((sum, data) => sum + (parseFloat(data.consumption) || 0), 0)
    .toFixed(2);

  const unitPrice = totalReading && totalConsumption 
    ? (parseFloat(totalReading) / parseFloat(totalConsumption)).toFixed(2) 
    : '0.00';

  // Utility functions
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

  // Handlers
  const handlePreviousReadingSubmit = (department, reading) => {
    setPreviousReadings(prev => ({ ...prev, [department]: parseFloat(reading).toFixed(2) }));
    setShowPreviousReadingModal(false);
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
    setCurrentReadings(prev => ({ ...prev, [DEPARTMENTS[currentDeptIndex]]: reading }));
    if (currentDeptIndex < DEPARTMENTS.length - 1) {
      setCurrentDeptIndex(prev => prev + 1);
    } else {
      setShowCurrentModal(false);
    }
  };

  // Guardar en base de datos
  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Preparar datos para enviar
      const departments = DEPARTMENTS.map(dept => ({
        department: dept,
        current_reading: parseFloat(currentReadings[dept]) || 0,
        previous_reading: parseFloat(previousReadings[dept]) || 0,
      })).filter(dept => dept.current_reading > 0); // Solo enviar departamentos con lectura

      if (departments.length === 0) {
        alert('Por favor, ingrese al menos una lectura de departamento');
        setLoading(false);
        return;
      }

      const readingData = {
        reading_date: selectedDate.toISOString().split('T')[0],
        lectura1: parseFloat(readingInputs.lectura1) || 0,
        lectura2: parseFloat(readingInputs.lectura2) || 0,
        periodo: getPeriodo(selectedDate),
        departments: departments,
      };

      // Guardar en la base de datos
      let response;
      if (savedReadingId) {
        // Actualizar si ya existe
        response = await readingService.updateReading(savedReadingId, readingData);
      } else {
        // Crear nuevo
        response = await readingService.saveReading(readingData);
        setSavedReadingId(response.data.id);
      }

      if (response.success) {
        setShowSaveSuccessModal(true);
        setTimeout(() => setShowSaveSuccessModal(false), MODAL_TIMEOUT);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar en la base de datos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleExportWithTemplate = async () => {
    try {
      const response = await fetch(TEMPLATE_PATH);
      const arrayBuffer = await response.arrayBuffer();
  
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);
  
      worksheet.getCell('E1').value = `Mes del informe: ${getPeriodo(selectedDate)}`;
      worksheet.getCell('E1').font = { bold: true, size: 14 };
      worksheet.getCell('E1').alignment = { vertical: 'middle', horizontal: 'left' };
  
      let totalConsumo = 0;
      let totalBs = 0;
      let totalBsRedondeado = 0;
  
      consumptionData.forEach((data, index) => {
        const fila = index + 3;
        const actual = parseFloat(data.current) || 0;
        const anterior = parseFloat(data.previous) || 0;
        const consumo = parseFloat((actual - anterior).toFixed(2));
        const totalFilaBs = parseFloat((consumo * parseFloat(unitPrice)).toFixed(2));
        const totalFilaRedondeado = Math.round(totalFilaBs);
  
        worksheet.getCell(`A${fila}`).value = formatFecha(selectedDate);
        worksheet.getCell(`B${fila}`).value = data.dept;
        worksheet.getCell(`C${fila}`).value = actual;
        worksheet.getCell(`D${fila}`).value = anterior;
        worksheet.getCell(`E${fila}`).value = consumo;
        worksheet.getCell(`F${fila}`).value = parseFloat(unitPrice);
        worksheet.getCell(`G${fila}`).value = totalFilaBs;
        worksheet.getCell(`H${fila}`).value = totalFilaRedondeado;
  
        totalConsumo += consumo;
        totalBs += totalFilaBs;
        totalBsRedondeado += totalFilaRedondeado;
      });
  
      const lectura1 = parseFloat(readingInputs.lectura1) || 0;
      const lectura2 = parseFloat(readingInputs.lectura2) || 0;
      const lecturaTotal = lectura1 + lectura2;
  
      worksheet.getCell('J3').value = lectura1;
      worksheet.getCell('J4').value = lectura2;
      worksheet.getCell('J5').value = lecturaTotal;
      worksheet.getCell('J6').value = parseFloat(totalConsumo.toFixed(2));
      worksheet.getCell('J7').value = totalConsumo !== 0 ? parseFloat((lecturaTotal / totalConsumo).toFixed(2)) : 0;
  
      worksheet.getCell('E18').value = parseFloat(totalConsumo.toFixed(2));
      worksheet.getCell('G18').value = parseFloat(totalBs.toFixed(2));
      worksheet.getCell('H18').value = totalBsRedondeado;
  
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      saveAs(blob, `ReporteGeMar_${getPeriodo(selectedDate)}.xlsx`);
      setShowExportSuccessModal(true);
      setTimeout(() => setShowExportSuccessModal(false), 2000);
  
    } catch (error) {
      console.error('Error exportando con plantilla:', error);
      alert('Error al exportar Excel con plantilla.');
    }
  };

  // Cargar datos existentes
  const handleLoadReading = async () => {
    const periodo = getPeriodo(selectedDate);
    try {
      setLoading(true);
      const response = await readingService.getReadingByPeriodo(periodo);
      
      if (response.success && response.data) {
        const data = response.data;
        
        // Cargar lecturas principales
        setReadingInputs({
          lectura1: data.lectura1,
          lectura2: data.lectura2,
          total: data.total_reading
        });
        setTotalReading(data.total_reading);
        setSavedReadingId(data.id);
        
        // Cargar lecturas de departamentos
        const currentReadingsObj = {};
        const previousReadingsObj = {};
        
        data.department_readings.forEach(dept => {
          currentReadingsObj[dept.department] = dept.current_reading;
          previousReadingsObj[dept.department] = dept.previous_reading;
        });
        
        setCurrentReadings(currentReadingsObj);
        setPreviousReadings(previousReadingsObj);
        
        alert('Datos cargados exitosamente');
      }
    } catch (error) {
      console.log('No hay datos guardados para este periodo');
      alert('No hay datos guardados para este periodo');
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10 md:p-20">
      {/* Modals */}
      <PreviousReadingModal
        isOpen={showPreviousReadingModal} 
        onClose={() => setShowPreviousReadingModal(false)} 
        onSubmit={handlePreviousReadingSubmit}
        department={selectedDepartment}
      />
      <ReadingInputModal 
        isOpen={showReadingModal} 
        onClose={() => setShowReadingModal(false)} 
        onSubmit={handleReadingSubmit} 
      />
      <CurrentReadingModal 
        isOpen={showCurrentModal} 
        onClose={() => setShowCurrentModal(false)} 
        onSubmit={handleCurrentReadingSubmit} 
        department={DEPARTMENTS[currentDeptIndex]} 
      />
      <SaveSuccessModal 
        isOpen={showSaveSuccessModal} 
        onClose={() => setShowSaveSuccessModal(false)} 
        message="¡Se guardó exitosamente!" 
      />
      <showExportSuccessModal
        isOpen={showExportSuccessModal} 
        onClose={() => setShowExportSuccessModal(false)} 
        message="¡Se descargó correctamente!" 
      />

      {/* Header */}
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

      {/* Readings Display */}
      <div className="mb-4 bg-white p-3 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#162c3b]">Lecturas Ingresadas</h2>
        </div>
        <div className="text-sm text-gray-700 grid grid-cols-3 gap-y-1">
          <p>Lectura 1: <span className="font-medium">{readingInputs.lectura1 || '--'}</span></p>
          <p>Lectura 2: <span className="font-medium">{readingInputs.lectura2 || '--'}</span></p>
          <p>Total: <span className="font-medium">{readingInputs.total || '--'}</span></p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-2 mt-4">
          <button 
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
            onClick={handleLoadReading}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Cargar Datos'}
          </button>
          <button 
            className="bg-[#162c3b] text-white px-3 py-1.5 rounded text-sm hover:bg-[#1f3e56] transition-colors"
            onClick={() => setShowReadingModal(true)}
          >
            Ingresar Lecturas
          </button>
          <button 
            className="bg-[#A31621] text-white px-3 py-1.5 rounded text-sm hover:bg-[#c4313b] transition-colors"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button 
            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors"
            onClick={handleExportWithTemplate}
          >
            Descargar Excel
          </button>
        </div>
      </div>

      {/* Consumption Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-[#162c3b] text-white">
            <tr>
              {['FECHA', 'DPTO', 'ACTUAL', 'ANTERIOR', 'CONSUMO', 'PRECIO CUBO', 'TOTAL Bs', 'TOTAL Bs (Redondeado)']
                .map(header => (
                  <th key={header} className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {consumptionData.map((data, index) => {
              const totalBs = data.consumption ? (parseFloat(data.consumption) * unitPrice).toFixed(2) : '';
              const roundedTotal = totalBs ? Math.round(totalBs) : '';
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">{formatFecha(selectedDate)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800 font-medium">{data.dept}</td>
                  <td 
                    className="border border-gray-300 px-4 py-2 text-gray-800 cursor-pointer hover:underline" 
                    onClick={() => { setCurrentDeptIndex(index); setShowCurrentModal(true); }}
                  >
                    {data.current ? parseFloat(data.current).toFixed(2) : ''}
                  </td>
                  <td 
                    className="border border-gray-300 px-4 py-2 text-gray-800 cursor-pointer hover:underline"
                    onClick={() => {
                      setSelectedDepartment(data.dept);
                      setShowPreviousReadingModal(true);
                    }}
                  >
                    {data.previous ? parseFloat(data.previous).toFixed(2) : '--'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">{data.consumption}</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">{unitPrice}</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">{totalBs}</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-800">{roundedTotal}</td>
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