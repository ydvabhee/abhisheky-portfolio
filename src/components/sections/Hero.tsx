import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Code, Database, Globe } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 md:px-8 bg-black text-white overflow-hidden">
      {/* Abstract Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute -top-20 -left-10 md:left-0 text-xs font-mono tracking-widest text-zinc-500"
        >
          // INITIALIZING SYSTEM<br/>
          // LOADING ASSETS...<br/>
          // READY
        </motion.div>

        <div className="overflow-hidden mb-4">
          <ScrambleText 
            text="ABHISHEK K" 
            className="text-[12vw] md:text-[8vw] leading-[0.9] font-black tracking-tighter block text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500"
          />
          <ScrambleText 
            text="YADAV" 
            className="text-[12vw] md:text-[8vw] leading-[0.9] font-black tracking-tighter block text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500"
            delay={1000}
          />
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="max-w-xl"
          >
            <p className="text-xl md:text-2xl font-light text-zinc-300 mb-6">
              Software Engineer specializing in <span className="text-white font-medium">Full-Stack Development</span> & <span className="text-white font-medium">AI Solutions</span>. 
              Crafting digital experiences that merge logic with creativity.
            </p>
            
            <div className="flex gap-4">
               <TechBadge icon={<Code size={16} />} text="Dev" />
               <TechBadge icon={<Database size={16} />} text="Data" />
               <TechBadge icon={<Globe size={16} />} text="Web" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2.5, duration: 1, ease: "circOut" }}
            className="h-[1px] bg-zinc-700 flex-1 mx-8 hidden md:block origin-left"
          />

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 3 }}
             className="text-sm font-bold flex items-center gap-2"
          >
            SCROLL TO EXPLORE <ArrowDown size={16} className="animate-bounce" />
          </motion.div>
        </div>
      </div>
      
      {/* Floating Elements / Parallax */}
      <motion.div style={{ y, opacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-800 font-black text-[20vw] -z-10 leading-none pointer-events-none select-none whitespace-nowrap">
        PORTFOLIO
      </motion.div>
    </section>
  );
};

// Sub-components

const TechBadge: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-medium hover:border-zinc-600 transition-colors">
    {icon}
    <span>{text}</span>
  </div>
);

const ScrambleText: React.FC<{ text: string, className?: string, delay?: number }> = ({ text, className, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;':,./<>?";

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let iteration = 0;
    
    const startScramble = () => {
      const interval = setInterval(() => {
        setDisplayText(text
          .split("")
          .map((_, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
        );
        
        if (iteration >= text.length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);
    };

    timeout = setTimeout(startScramble, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <motion.h1 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      {displayText}
    </motion.h1>
  );
};

export default Hero;