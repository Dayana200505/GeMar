import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CurrentReadingModal = ({ isOpen, onClose, onSubmit, department }) => {
  const [currentReading, setCurrentReading] = useState('');

  const handleSubmit = () => {
    if (currentReading) {
      onSubmit(parseFloat(currentReading).toFixed(2));
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
          <input
            type="number"
            step="0.01"
            value={currentReading}
            onChange={(e) => setCurrentReading(e.target.value)}
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
            Enviar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentReadingModal;
