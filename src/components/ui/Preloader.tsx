import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import metadata from '../../data/metadata.json';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set initial size
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    // Optional: Handle resize if needed, though preloader is usually short-lived
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Avoid running calculation until window size is available (client-side)
  if (windowSize.width === 0) return null;

  // Calculation for target position
  // Navbar logo center: x = 32px (px-8) + 20px (half width) = 52px
  // Navbar logo center: y = 24px (py-6) + 20px (half height) = 44px
  // Preloader center: window.width / 2, window.height / 2
  const targetX = 52 - windowSize.width / 2;
  const targetY = 44 - windowSize.height / 2;

  // Scale calculation: Target width 40px (w-10), Initial width 128px (w-32)
  // Scale factor = 40 / 128 ≈ 0.3125
  const scaleFactor = 40 / 128;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
    >
      <motion.div
        className="relative flex flex-col items-center"
      >
        <motion.div 
          className="rounded-full overflow-hidden w-32 h-32 bg-white dark:bg-black"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1, scaleFactor],
            opacity: [0, 1, 1, 1],
            x: [0, 0, 0, targetX],
            y: [0, 0, 0, targetY],
          }}
          transition={{
            duration: 2.5,
            times: [0, 0.4, 0.7, 1],
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