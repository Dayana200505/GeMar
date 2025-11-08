import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExportSuccessModal = ({ isOpen, onClose, message = '¡Se descargó correctamente!' }) => {
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        onClose();
      }, 2500); // se cierra automáticamente en 2.5 segundos
      return () => clearTimeout(timeout);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm text-center"
          >
            <div className="text-green-500 text-5xl mb-2">✅</div>
            <h2 className="text-xl font-semibold text-green-700 mb-2">{message}</h2>
            <p className="text-gray-600 text-sm">Puedes encontrar el archivo en tus descargas.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportSuccessModal;
