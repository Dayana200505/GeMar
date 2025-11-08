import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 

const Home = () => {
  // Animation variants for text
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  // Animation for CTA button
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, delay: 0.5, type: 'spring', stiffness: 100 },
    },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/image/Image_fx.jpg')", 
      }}
      aria-label="Home Hero Section"
    >
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20"></div>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Main Heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg font-[Poppins]"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Bienvenido a Gestión de Cuentas
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-200 font-light max-w-2xl"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          Mar del Palta: Simplifica y optimiza tus finanzas con nuestra plataforma intuitiva.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="mt-8"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Link
            to="/elegir-gestion"
            className="inline-block px-8 py-3 text-lg font-semibold text-white bg-[#A31621] rounded-full shadow-lg hover:bg-[#CC998D] focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 focus:ring-offset-transparent transition-colors"
            aria-label="Explorar la plataforma de gestión de cuentas"
          >
           Realizar informe
          </Link>
        </motion.div>
      </div>

    
    </section>
  );
};

export default Home;