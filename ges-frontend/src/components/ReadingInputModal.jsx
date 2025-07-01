import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReadingInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [reading1, setReading1] = useState('');
  const [reading2, setReading2] = useState('');

  const handleSubmit = () => {
    const total = (parseFloat(reading1) || 0) + (parseFloat(reading2) || 0);
    if (total > 0) {
      onSubmit(total.toFixed(2));
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
        <h2 className="text-xl font-bold mb-4">Ingresar Lecturas de Agua</h2>
        <div className="mb-4">
          <label className="block mb-2">Lecruta 1</label>
          <input
            type="number"
            step="0.01"
            value={reading1}
            onChange={(e) => setReading1(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0.00"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Lectura 2</label>
          <input
            type="number"
            step="0.01"
            value={reading2}
            onChange={(e) => setReading2(e.target.value)}
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
            onClick={() => onSubmit(reading1, reading2)}
            className="px-4 py-2 bg-[#A31621] text-white rounded"
            disabled={!reading1 || !reading2}
          >
            Enviar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReadingInputModal;
