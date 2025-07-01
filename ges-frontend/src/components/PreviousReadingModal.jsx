import React, { useState } from 'react';

const PreviousReadingModal = ({ isOpen, onClose, onSubmit, department }) => {
  const [previousReading, setPreviousReading] = useState('');

  const handleSubmit = () => {
    onSubmit(department, previousReading);
    setPreviousReading('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4">
          Ingresar lectura actual para <strong>{department}</strong>
        </h2>
        <input
          type="number"
          step="0.01"
          value={previousReading}
          onChange={(e) => setPreviousReading(e.target.value)}
          placeholder="Ingrese lectura anterior"
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#162c3b] text-white px-4 py-2 rounded hover:bg-[#A31621]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviousReadingModal;