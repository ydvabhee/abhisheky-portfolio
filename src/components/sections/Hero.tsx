import React from 'react';
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowDown, Code, Database, Globe } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section 
      className="relative min-h-screen flex flex-col justify-center px-4 md:px-8 bg-[#F0F0F0] dark:bg-[#0A0A0A] text-black dark:text-white overflow-hidden transition-colors duration-500 group"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
      </div>

      {/* Spotlight (Blue Tint) */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 hidden dark:block"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 87, 255, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 max-w-[90rem] mx-auto w-full pt-20">
        {/* Architectural Header Elements */}
        <div className="absolute top-0 right-0 hidden md:flex flex-col items-end gap-1 text-[10px] font-mono tracking-widest opacity-50">
           <span>COORD: 12.9716° N, 77.5946° E</span>
           <span>EST. 2025</span>
        </div>

        {/* Main Title - Swiss Style Typography */}
        <div className="flex flex-col gap-[-1rem] select-none cursor-default mix-blend-difference dark:mix-blend-normal">
           <div className="overflow-hidden">
             <motion.h1 
               initial={{ y: 200, skewY: 10 }}
               animate={{ y: 0, skewY: 0 }}
               transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
               className="text-[14vw] leading-[0.8] font-black tracking-tighter text-black dark:text-white"
             >
               ABHISHEK
             </motion.h1>
           </div>
           
           <div className="flex items-center gap-4 md:gap-8 -mt-2 md:-mt-6">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "auto" }}
               transition={{ duration: 1, delay: 0.4, ease: "circOut" }}
               className="h-[8vw] bg-[#0057FF] flex items-center justify-center overflow-hidden px-6 md:px-12"
             >
               <span className="text-white font-bold text-xl md:text-5xl tracking-tighter whitespace-nowrap">
                 K. YADAV
               </span>
             </motion.div>
             
             <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="hidden md:block h-[1px] flex-1 bg-current opacity-20"
             />
             
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1 }}
               className="hidden md:block text-xs font-mono max-w-[200px] leading-tight opacity-60"
             >
               FULL STACK ENGINEER <br />
               AI & AUTOMATION SPECIALIST
             </motion.p>
           </div>
        </div>

        {/* Bottom Interaction Area */}
        <div className="mt-24 md:mt-32 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="flex flex-col gap-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.2 }}
               className="flex gap-4"
             >
               <TechBadge icon={<Code size={16} />} text="DEVELOPMENT" />
               <TechBadge icon={<Database size={16} />} text="ARCHITECTURE" />
               <TechBadge icon={<Globe size={16} />} text="DESIGN" />
             </motion.div>
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.4 }}
               className="text-lg md:text-2xl font-medium max-w-xl leading-snug"
             >
               Transforming complex problems into <span className="text-[#0057FF]">elegant solutions</span>. 
               Building the future of web with precision and passion.
             </motion.p>
          </div>

          <motion.a 
            href="#work"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-4 bg-[#0057FF] text-white px-10 py-5 rounded-none font-bold text-lg tracking-wider hover:bg-blue-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          >
            VIEW PROJECTS
            <ArrowDown size={24} />
          </motion.a>
        </div>
      </div>

      {/* Vertical Marquee */}
      <div className="absolute top-0 right-0 h-full w-24 hidden xl:flex flex-col items-center justify-center border-l border-zinc-200 dark:border-zinc-800">
        <motion.div 
          style={{ y }} 
          className="whitespace-nowrap -rotate-90 text-xs font-mono tracking-[0.2em] opacity-30"
        >
          SCROLL TO EXPLORE — SCROLL TO EXPLORE — SCROLL TO EXPLORE
        </motion.div>
      </div>
    </section>
  );
};

const TechBadge: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold tracking-wider uppercase shadow-sm">
    {icon}
    <span>{text}</span>
  </div>
);

export default Hero;
