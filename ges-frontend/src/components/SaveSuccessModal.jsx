// components/SaveSuccessModal.js
import React from 'react';
import { motion } from 'framer-motion';

const SaveSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <h2 className="text-xl font-semibold text-[#A31621] mb-4">Éxito</h2>
        <p className="text-gray-700">Se guardó correctamente.</p>
        <button
          className="mt-4 bg-[#162c3b] text-white px-4 py-2 rounded hover:bg-[#A31621] transition-colors"
          onClick={onClose}
        >
          Cerrar
        </button>
      </motion.div>
    </div>
  );
};

export default SaveSuccessModal;