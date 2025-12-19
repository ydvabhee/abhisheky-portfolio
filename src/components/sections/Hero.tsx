import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center px-8 bg-white pt-20">
      <div className="overflow-hidden">
        <motion.h1 
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="text-[12vw] leading-[0.9] font-black tracking-tighter"
        >
          ABHISHEK K<br />YADAV
        </motion.h1>
      </div>
      <div className="mt-8 flex justify-between items-end">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md text-xl font-medium"
        >
          SOFTWARE ENGINEER SPECIALIZING IN FULL-STACK DEVELOPMENT & AI. BASED IN BENGALURU.
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="h-[1px] bg-black flex-1 mx-12 hidden md:block origin-left"
        />
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
           className="text-sm font-bold"
        >
          SCROLL TO EXPLORE ↓
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
