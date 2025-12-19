import React from 'react';
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowDown, Code, Database, Globe } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Mouse spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section 
      className="relative min-h-screen flex flex-col justify-center px-4 md:px-8 bg-white dark:bg-black text-black dark:text-white overflow-hidden transition-colors duration-500 group"
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight Effect (Dark Mode only) */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 hidden dark:block"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />

      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.1] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 max-w-[90rem] mx-auto w-full">
        {/* Decorative Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute -top-32 left-0 hidden md:flex items-center gap-4 text-xs font-mono tracking-widest opacity-40"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          SYSTEM ONLINE
        </motion.div>

        {/* Main Title Area */}
        <div className="flex flex-col gap-0 select-none cursor-default">
           <div className="overflow-hidden">
             <motion.h1 
               initial={{ y: 200 }}
               animate={{ y: 0 }}
               transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
               className="text-[13vw] leading-[0.8] font-black tracking-tighter mix-blend-exclusion dark:mix-blend-normal"
             >
               ABHISHEK
             </motion.h1>
           </div>
           <div className="overflow-hidden flex items-center gap-4 md:gap-12">
             <motion.h1 
               initial={{ y: 200 }}
               animate={{ y: 0 }}
               transition={{ duration: 1, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
               className="text-[13vw] leading-[0.8] font-black tracking-tighter text-zinc-300 dark:text-zinc-700"
             >
               K.
             </motion.h1>
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "auto" }}
               transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
               className="h-[8vw] md:h-[6vw] flex-1 bg-black dark:bg-white overflow-hidden flex items-center justify-center"
             >
               <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-white dark:text-black font-mono text-xs md:text-xl whitespace-nowrap px-4"
               >
                 FULL STACK & AI ENGINEER
               </motion.span>
             </motion.div>
           </div>
           <div className="overflow-hidden">
             <motion.h1 
               initial={{ y: 200 }}
               animate={{ y: 0 }}
               transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
               className="text-[13vw] leading-[0.8] font-black tracking-tighter mix-blend-exclusion dark:mix-blend-normal"
             >
               YADAV
             </motion.h1>
           </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 md:mt-24 flex flex-col md:flex-row justify-between items-end gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="max-w-md"
          >
            <p className="text-lg md:text-xl font-medium leading-relaxed opacity-80">
              Based in Bengaluru. Crafting scalable digital ecosystems with a focus on <span className="underline decoration-2 underline-offset-4 decoration-blue-500">performance</span> and <span className="underline decoration-2 underline-offset-4 decoration-purple-500">user experience</span>.
            </p>
            
            <div className="flex gap-3 mt-8">
               <TechBadge icon={<Code size={14} />} text="Engineering" />
               <TechBadge icon={<Database size={14} />} text="Architecture" />
               <TechBadge icon={<Globe size={14} />} text="Design" />
            </div>
          </motion.div>

          <motion.a 
            href="#work"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 1.5 }}
            className="group flex items-center gap-4 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold text-lg tracking-wide hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            SEE MY WORK
            <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
          </motion.a>
        </div>
      </div>
      
      {/* Background Parallax Text */}
      <motion.div style={{ y, opacity }} className="absolute top-[20%] right-[-10%] text-[20rem] font-black text-black/5 dark:text-white/5 -z-10 rotate-90 pointer-events-none select-none">
        PORTFOLIO
      </motion.div>
    </section>
  );
};

const TechBadge: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
    {icon}
    <span>{text}</span>
  </div>
);

export default Hero;
