import React from 'react';
import { motion } from 'framer-motion';

const ExportSuccessModal = ({ isOpen, onClose, message = '¡Se descargó correctamente!' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center"
      >
        <h2 className="text-xl font-semibold text-green-700 mb-4">{message}</h2>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Cerrar
        </button>
      </motion.div>
    </div>
  );
};

export default ExportSuccessModal;
