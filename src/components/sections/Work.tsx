import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import metadata from '../../data/metadata.json';

const Work: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create a smooth drawing effect for the path
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="work" className="py-32 px-4 md:px-8 bg-white dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-500 border-t border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto relative">
        
        {/* Section Title */}
        <div className="flex flex-col items-center mb-32 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none uppercase"
          >
            {metadata.work.title}
          </motion.h2>
          <p className="mt-4 text-xs font-mono uppercase tracking-widest opacity-50">A Journey of Growth</p>
        </div>

        {/* The Glowing Path (SVG) */}
        <div className="absolute left-[28px] md:left-1/2 top-[180px] bottom-0 w-[4px] -translate-x-1/2 h-full z-0">
          {/* Background Track */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/5 dark:bg-white/10 rounded-full" />
          
          {/* Glowing Fill */}
          <motion.div 
            style={{ height: useTransform(pathLength, [0, 1], ["0%", "100%"]) }}
            className="absolute top-0 left-0 w-full bg-black dark:bg-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] dark:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />
        </div>

        {/* Experience Nodes */}
        <div ref={containerRef} className="space-y-32 relative z-10">
          {metadata.work.experiences.map((exp, index) => (
            <TimelineItem key={exp.id} experience={exp} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

type Experience = typeof metadata.work.experiences[0];

const TimelineItem: React.FC<{ experience: Experience, index: number }> = ({ experience, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`relative flex flex-col md:flex-row gap-12 md:gap-24 ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      
      {/* Central Node (The "Station") */}
      <div className="absolute left-[28px] md:left-1/2 top-8 w-6 h-6 -translate-x-1/2 flex items-center justify-center z-20">
         <motion.div 
           initial={{ scale: 0 }}
           whileInView={{ scale: 1 }}
           viewport={{ once: true }}
           transition={{ type: "spring", stiffness: 300, damping: 20 }}
           className="w-4 h-4 rounded-full bg-white dark:bg-black border-[4px] border-black dark:border-white shadow-[0_0_0_4px_rgba(255,255,255,0.5)] dark:shadow-[0_0_0_4px_rgba(0,0,0,0.5)]"
         />
      </div>

      {/* Content Card */}
      <div className={`flex-1 pl-20 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
         
         {/* Date Label (Floating above) */}
         <div className={`text-xs font-mono uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2 ${isEven ? 'md:justify-end' : ''}`}>
            <Calendar size={12} />
            <span>{experience.period}</span>
         </div>

         {/* Main Card */}
         <div className="group relative bg-zinc-50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 p-8 rounded-2xl hover:border-black/20 dark:hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
            
            {/* Connector Line (Desktop) */}
            <div className={`hidden md:block absolute top-8 w-12 h-[1px] bg-black/10 dark:bg-white/10 ${isEven ? '-right-12' : '-left-12'}`} />

            <div className={`flex flex-col gap-2 ${isEven ? 'md:items-end' : ''}`}>
               <h3 className="text-3xl font-black tracking-tight uppercase">{experience.company}</h3>
               <div className="flex items-center gap-2 text-sm font-medium opacity-60">
                 <span>{experience.role}</span>
                 <span>•</span>
                 <span className="flex items-center gap-1"><MapPin size={12} /> {experience.location}</span>
               </div>
            </div>

            <div className={`mt-6 space-y-2 opacity-80 leading-relaxed text-sm ${isEven ? 'md:text-right' : ''}`}>
               {experience.description.map((point, i) => (
                 <p key={i}>{point}</p>
               ))}
            </div>

            <div className={`mt-8 flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : ''}`}>
               {experience.tech.map((tech, i) => (
                  <span key={i} className="px-3 py-1 text-[10px] font-bold border border-black/10 dark:border-white/10 rounded-full uppercase tracking-wider bg-white dark:bg-black/50">
                    {tech}
                  </span>
               ))}
            </div>

         </div>
      </div>

      {/* Empty space for alignment */}
      <div className="hidden md:block flex-1" />

    </motion.div>
  );
};

export default Work;
