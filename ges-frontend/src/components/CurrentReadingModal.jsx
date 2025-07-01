import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CurrentReadingModal = ({ isOpen, onClose, onSubmit, department }) => {
  const [currentReading, setCurrentReading] = useState('');

  useEffect(() => {
    if (isOpen) setCurrentReading('');
  }, [isOpen, department]);

  const handleChange = (e) => {
    const value = e.target.value;
    // Allow empty input or any valid number (including decimals)
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setCurrentReading(value);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(currentReading);
    if (!isNaN(parsed)) {
      setCurrentReading(parsed.toFixed(2));
    } else if (currentReading === '') {
      setCurrentReading('');
    }
  };

  const handleSubmit = () => {
    const parsed = parseFloat(currentReading);
    if (!isNaN(parsed)) {
      onSubmit(parsed.toFixed(2));
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          Ingresar lectura actual para <strong>{department}</strong>
        </h2>
        <div className="mb-4">
          <label className="block mb-2">Lectura</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={currentReading}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded"
            placeholder="0.00"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#A31621] text-white rounded"
            disabled={!currentReading}
          >
            Guardar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentReadingModal;