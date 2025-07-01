import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SaveSuccessModal = ({ isOpen, onClose }) => {
  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modal = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">¡Guardado exitoso!</h2>
            <p className="text-gray-600 mb-6">Tus cambios han sido guardados correctamente.</p>
       
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveSuccessModal;
