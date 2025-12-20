'use client';
import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowDown, Code, Database, Globe } from 'lucide-react';
import metadata from '../../data/metadata.json';
import TextPressure from '../ui/TextPressure';
import SplashCursor from '../ui/SplashCursor';

const Hero: React.FC<{ startAnimation?: boolean }> = ({ startAnimation = true }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section 
      className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white overflow-hidden transition-colors duration-500 pt-32 pb-12"
      onMouseMove={handleMouseMove}
    >
      <SplashCursor />

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Spotlight (White/Gray Tint) */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 hidden dark:block"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      {/* Top Meta Info */}
      <div className="relative z-10 flex justify-between items-start text-xs font-mono uppercase tracking-widest border-b border-black/10 dark:border-white/10 pb-6 mb-12">
        <div className="flex flex-col gap-1">
          <span className="font-bold">{metadata.hero.role}</span>
          <span className="opacity-50">{metadata.hero.subRole}</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span>{metadata.hero.location}</span>
          <span className="opacity-50">{metadata.hero.coordinates}</span>
        </div>
      </div>

      {/* Main Typography Block */}
      <div className="relative z-10 flex-1 flex flex-col justify-center gap-6">
         
         {/* Line 1: First Name */}
         <div className="w-full xl:w-[90%] self-start">
           <motion.div 
             initial={{ y: "100%", opacity: 0 }}
             animate={startAnimation ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
             transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
           >
             <TextPressure 
                text={metadata.hero.firstName} 
                flex={true} 
                alpha={false} 
                stroke={false} 
                width={true} 
                weight={true} 
                italic={true} 
                textColor="currentColor" 
                minFontSize={24}
             />
           </motion.div>
         </div>

         {/* Line 2: Middle + Last Name */}
         <div className="w-full xl:w-[90%] self-start">
           <motion.div 
             initial={{ y: "100%", opacity: 0 }}
             animate={startAnimation ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
             transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
           >
             <TextPressure 
                text={`${metadata.hero.middleName} ${metadata.hero.lastName}`} 
                flex={true} 
                alpha={false} 
                stroke={false} 
                width={true} 
                weight={true} 
                italic={true} 
                textColor="currentColor" 
                minFontSize={24}
             />
           </motion.div>
         </div>

      </div>

      {/* Bottom Layout */}
      <div className="relative z-10 mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        
        {/* Description */}
        <div className="col-span-1 md:col-span-5">
           <motion.p 
             initial={{ opacity: 0 }}
             animate={startAnimation ? { opacity: 1 } : { opacity: 0 }}
             transition={{ delay: 1 }}
             className="text-lg md:text-xl font-medium leading-relaxed opacity-80"
           >
             Crafting digital ecosystems with a focus on <span className="underline decoration-2 underline-offset-4 font-bold">minimalism</span> and <span className="underline decoration-2 underline-offset-4 font-bold">performance</span>.
           </motion.p>
           <div className="flex gap-3 mt-6">
             <TechBadge icon={<Code size={14} />} text={metadata.hero.tags[0]} />
             <TechBadge icon={<Database size={14} />} text={metadata.hero.tags[1]} />
             <TechBadge icon={<Globe size={14} />} text={metadata.hero.tags[2]} />
           </div>
        </div>

        {/* Spacer */}
        <div className="hidden md:block md:col-span-3"></div>

        {/* CTA & Copyright */}
        <div className="col-span-1 md:col-span-4 flex flex-col items-start md:items-end gap-6">
          <motion.a 
            href="#work"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={startAnimation ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-4 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
          >
            {metadata.hero.cta}
            <ArrowDown size={18} />
          </motion.a>
        </div>

      </div>

      {/* Styles */}
      <style>{`
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>
    </section>
  );
};

const TechBadge: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
    {icon}
    <span>{text}</span>
  </div>
);

export default Hero;