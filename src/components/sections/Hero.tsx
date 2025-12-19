import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between px-4 md:px-8 bg-[#F3F0E7] dark:bg-[#0A0A0A] text-[#4353FF] overflow-hidden transition-colors duration-500 pt-24 pb-8">
      
      {/* Background Texture (Noise) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Side Shapes (The "Pinch" Effect) */}
      {/* Left Shape */}
      <div className="absolute top-0 bottom-0 left-0 w-[25vw] md:w-[35vw] pointer-events-none z-10 hidden md:block">
         <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="w-full h-full fill-[#4353FF]">
            {/* Draw a shape that starts at top-left, goes down, curves in towards center, then back to top-left */}
            <path d="M0,0 L0,200 Q100,100 0,0 Z" />
         </svg>
      </div>
      
      {/* Right Shape */}
      <div className="absolute top-0 bottom-0 right-0 w-[25vw] md:w-[35vw] pointer-events-none z-10 hidden md:block">
         <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="w-full h-full fill-[#4353FF]">
             <path d="M100,0 L100,200 Q0,100 100,0 Z" />
         </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 flex flex-col justify-center items-center w-full max-w-7xl mx-auto mt-12 md:mt-0">
        
        {/* Top Label */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-8 md:mb-12 text-black dark:text-white"
        >
          by ABHISHEK K YADAV
        </motion.div>

        {/* Central Typography Block */}
        <div className="flex items-center gap-4 md:gap-12">
          
          {/* Vertical Text (Left side of title) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="hidden md:block writing-vertical-rl rotate-180 text-xl md:text-4xl font-black tracking-[0.15em] text-[#4353FF] h-[40vh] text-outline-blue opacity-50"
          >
            SOFTWARE ENGINEER
          </motion.div>

          {/* Main Titles */}
          <div className="flex flex-col leading-[0.8] items-center md:items-start">
            {/* Row 1: PORT 20 */}
            <div className="flex items-baseline gap-2">
               <motion.h1 
                 initial={{ y: 100, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                 className="text-[25vw] md:text-[18vw] font-black tracking-tighter uppercase transform scale-y-125 text-[#4353FF]"
               >
                 PORT
               </motion.h1>
               <motion.span 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.8, type: "spring" }}
                 className="text-[12vw] md:text-[8vw] font-black tracking-tighter text-outline-blue transform -translate-y-4 md:-translate-y-8"
               >
                 20
               </motion.span>
            </div>

            {/* Row 2: FOLIO 25 */}
            <div className="flex items-baseline gap-2 -mt-4 md:-mt-12 ml-0 md:ml-32">
               <motion.h1 
                 initial={{ y: 100, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                 className="text-[25vw] md:text-[18vw] font-black tracking-tighter uppercase transform scale-y-125 text-[#4353FF]"
               >
                 FOLIO
               </motion.h1>
               <motion.span 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.9, type: "spring" }}
                 className="text-[12vw] md:text-[8vw] font-black tracking-tighter text-outline-blue transform -translate-y-4 md:-translate-y-8"
               >
                 25
               </motion.span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="w-full h-[3px] bg-black dark:bg-white relative z-20 mt-12 md:mt-0"
      />
      
      <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-[10px] md:text-xs font-bold tracking-widest uppercase text-black dark:text-white relative z-20 gap-4 md:gap-0">
         <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-black">A</div>
           <span>Based in Bengaluru, India</span>
         </div>
         <div className="opacity-50">
           © 2025 All rights reserved
         </div>
      </div>

      {/* CSS for custom vertical text and outlines */}
      <style>{`
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
        .text-outline-blue {
          -webkit-text-stroke: 2px #4353FF;
          color: transparent;
        }
        @media (min-width: 768px) {
           .text-outline-blue {
            -webkit-text-stroke: 3px #4353FF;
           }
        }
      `}</style>
    </section>
  );
};

export default Hero;