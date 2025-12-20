'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import metadata from '../../data/metadata.json';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [dimension, setDimension] = useState({ 
    width: 0, 
    height: 0,
    breakpointWidth: 0 
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimension({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        breakpointWidth: window.innerWidth
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Avoid running calculation until window size is available
  if (dimension.width === 0) return null;

  // Calculation for target position
  // Navbar padding: px-6 (24px) for < md (768px), px-8 (32px) for >= md
  const isDesktop = dimension.breakpointWidth >= 768;
  const navPaddingX = isDesktop ? 32 : 24;
  const navPaddingY = 24; // py-6
  const logoSize = 40; // w-10
  const logoHalf = logoSize / 2;

  // Navbar logo center coordinates from top-left (relative to viewport content area)
  const logoCenterX = navPaddingX + logoHalf;
  const logoCenterY = navPaddingY + logoHalf;

  // Screen center coordinates (relative to visible content area)
  const screenCenterX = dimension.width / 2;
  const screenCenterY = dimension.height / 2;

  // Distance to move (Target - Start)
  const targetX = logoCenterX - screenCenterX;
  const targetY = logoCenterY - screenCenterY;

  // Scale calculation: Target width 40px (w-10), Initial width 128px (w-32)
  const scaleFactor = logoSize / 128;

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
          className="rounded-full overflow-hidden w-32 h-32 bg-white dark:bg-black relative"
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
          <Image 
            src={metadata.navbar.logo} 
            alt="Logo" 
            fill
            className="object-cover"
            sizes="128px"
            priority
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Preloader;