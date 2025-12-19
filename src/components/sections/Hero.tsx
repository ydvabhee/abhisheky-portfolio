import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between px-4 md:px-8 bg-[#F5F2EB] dark:bg-[#0A0A0A] text-[#5454D4] dark:text-[#7F7FD5] overflow-hidden transition-colors duration-500 pt-24 pb-8">
      
      {/* Background Texture (Noise) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Side Shapes (The "Pinch" Effect) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[15vw] h-[80vh] hidden md:block pointer-events-none z-10">
         <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="w-full h-full fill-[#5454D4] dark:fill-[#7F7FD5]">
            <path d="M0,0 L0,200 C50,150 100,100 0,0 Z" /> 
            {/* Actually, let's try a simple curve. The ref image has blue on the EDGES. 
                It looks like the blue shape starts wide at top/bottom and narrows at the center? 
                Or is it a curve pointing IN? 
                Let's try a shape that matches the reference: ) ( 
            */}
             <path d="M0,0 V200 Q100,100 0,0 Z" />
         </svg>
      </div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[15vw] h-[80vh] hidden md:block pointer-events-none z-10">
         <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="w-full h-full fill-[#5454D4] dark:fill-[#7F7FD5]">
             <path d="M100,0 V200 Q0,100 100,0 Z" />
         </svg>
      </div>


      {/* Main Content Area */}
      <div className="relative z-20 flex-1 flex flex-col justify-center items-center w-full max-w-7xl mx-auto">
        
        {/* Top Label */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base font-bold tracking-widest uppercase mb-4 md:mb-8 text-black dark:text-white"
        >
          by ABHISHEK YADAV
        </motion.div>

        {/* Central Typography Block */}
        <div className="flex items-center gap-4 md:gap-8">
          
          {/* Vertical Text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="hidden md:block writing-vertical-rl rotate-180 text-xl md:text-3xl font-bold tracking-[0.2em] text-[#5454D4] dark:text-[#7F7FD5] opacity-60 h-[30vh]"
          >
            SOFTWARE ENGINEER
          </motion.div>

          {/* Main Titles */}
          <div className="flex flex-col leading-[0.85]">
            {/* Row 1: PORT 20 */}
            <div className="flex items-baseline gap-2 md:gap-4">
               <motion.h1 
                 initial={{ y: 100, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                 className="text-[22vw] md:text-[16vw] font-black tracking-tighter uppercase transform scale-y-110"
               >
                 PORT
               </motion.h1>
               <motion.span 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.8, type: "spring" }}
                 className="text-[10vw] md:text-[8vw] font-black tracking-tighter text-outline-blue"
               >
                 20
               </motion.span>
            </div>

            {/* Row 2: FOLIO 25 */}
            <div className="flex items-baseline gap-2 md:gap-4">
               <motion.h1 
                 initial={{ y: 100, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                 className="text-[22vw] md:text-[16vw] font-black tracking-tighter uppercase transform scale-y-110"
               >
                 FOLIO
               </motion.h1>
               <motion.span 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.9, type: "spring" }}
                 className="text-[10vw] md:text-[8vw] font-black tracking-tighter text-outline-blue"
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
        className="w-full h-[2px] bg-black dark:bg-white opacity-10 relative z-20 mt-8"
      />
      
      <div className="flex justify-between items-center pt-4 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-60 text-black dark:text-white relative z-20">
         <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">A</div>
           <span>Based in Bengaluru</span>
         </div>
         <div>
           March 2025 — All rights are reserved©
         </div>
      </div>

      {/* CSS for custom vertical text and outlines if needed */}
      <style>{`
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
        .text-outline-blue {
          -webkit-text-stroke: 2px currentColor;
          color: transparent;
        }
      `}</style>
    </section>
  );
};

export default Hero;