import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import metadata from '../../data/metadata.json';

const Work: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="work" className="py-24 px-4 md:px-8 bg-white dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-500 border-t border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black tracking-tighter text-center mb-6 uppercase"
          >
            {metadata.work.title}
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            className="h-2 bg-black dark:bg-white"
          />
        </div>

        <div ref={containerRef} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[2px] bg-zinc-100 dark:bg-zinc-900 -translate-x-1/2">
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute top-0 left-0 w-full h-full bg-black dark:bg-white"
            />
          </div>

          <div className="space-y-12 md:space-y-32">
            {metadata.work.experiences.map((exp, index) => (
              <TimelineItem key={exp.id} experience={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Update type definition for props if needed, but since we are mapping directly from JSON, 
// we can infer or define an interface matching the JSON structure.
// For simplicity in this refactor, I'll inline the type or use 'any' implicitly if strictness allows, 
// but let's be better and define a quick interface or use typeof metadata.work.experiences[0]
type Experience = typeof metadata.work.experiences[0];

const TimelineItem: React.FC<{ experience: Experience, index: number }> = ({ experience, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative flex flex-col md:flex-row gap-12 ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Timeline Node */}
      <div className="absolute left-[19px] md:left-1/2 top-0 w-5 h-5 rounded-full bg-black dark:bg-white border-[4px] border-white dark:border-black z-10 -translate-x-1/2 md:translate-y-2 box-content" />

      {/* Content Side */}
      <div className={`flex-1 pl-16 md:pl-0 ${isEven ? 'md:pr-32 md:text-right' : 'md:pl-32'}`}>
        <div className="flex flex-col gap-4 group">
          <div>
             <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-none mb-2 hover:opacity-50 transition-opacity duration-300">{experience.company}</h3>
             <h4 className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-widest text-xs md:text-sm">{experience.role}</h4>
          </div>
          
          <div className={`flex flex-wrap gap-6 text-[10px] font-mono opacity-60 uppercase tracking-widest ${isEven ? 'md:justify-end' : ''}`}>
            <span className="flex items-center gap-2">
              <Calendar size={14} /> {experience.period}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} /> {experience.location}
            </span>
          </div>

          <p className="text-lg leading-relaxed opacity-80 max-w-lg">
            {experience.description.map((point, i) => (
              <span key={i} className="block mb-2 last:mb-0">
                {point}
              </span>
            ))}
          </p>

          <div className={`flex flex-wrap gap-2 mt-4 ${isEven ? 'md:justify-end' : ''}`}>
            {experience.tech.map((tech, i) => (
              <span 
                key={i} 
                className="px-3 py-1 text-[10px] font-bold border border-black/10 dark:border-white/10 rounded-sm uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Empty Side for layout balance on desktop */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
};

export default Work;
