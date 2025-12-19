import React from 'react';
import { motion } from 'framer-motion';
import metadata from '../../data/metadata.json';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: [0.5, 1.5, 1], 
          opacity: [0, 1, 1],
          y: [0, 0, -40]
        }}
        transition={{ 
          duration: 2, 
          times: [0, 0.6, 1],
          ease: "circOut"
        }}
        className="relative flex flex-col items-center"
      >
        <motion.div 
          className="rounded-full overflow-hidden w-32 h-32 md:w-48 md:h-48 shadow-2xl"
          animate={{
             y: [0, -window.innerHeight/2 + 60],
             x: [0, -window.innerWidth/2 + 60],
             scale: [1, 0.2]
          }}
          transition={{
            delay: 2.2,
            duration: 1,
            ease: [0.76, 0, 0.24, 1]
          }}
          onAnimationComplete={onComplete}
        >
          <img 
            src={metadata.navbar.logo} 
            alt="Logo" 
            className="w-full h-full object-cover" 
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Preloader;
