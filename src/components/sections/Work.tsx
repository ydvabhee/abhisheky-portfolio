import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { experiences } from '../../data/experience';
import { Calendar, MapPin } from 'lucide-react';

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
    <section id="work" className="py-24 px-4 md:px-8 bg-white dark:bg-[#0A0A0A] text-black dark:text-white relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black tracking-tighter text-center mb-6 uppercase"
          >
            Experience
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            className="h-2 bg-[#0057FF]"
          />
        </div>

        <div ref={containerRef} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[2px] bg-zinc-200 dark:bg-zinc-800 -translate-x-1/2">
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute top-0 left-0 w-full h-full bg-[#0057FF]"
            />
          </div>

          <div className="space-y-12 md:space-y-32">
            {experiences.map((exp, index) => (
              <TimelineItem key={exp.id} experience={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineItem: React.FC<{ experience: typeof experiences[0], index: number }> = ({ experience, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative flex flex-col md:flex-row gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Timeline Node */}
      <div className="absolute left-[19px] md:left-1/2 top-0 w-5 h-5 rounded-full bg-[#0057FF] border-[4px] border-white dark:border-[#0A0A0A] z-10 -translate-x-1/2 md:translate-y-2 box-content" />

      {/* Content Side */}
      <div className={`flex-1 pl-12 md:pl-0 ${isEven ? 'md:pr-20 md:text-right' : 'md:pl-20'}`}>
        <div className="flex flex-col gap-4 group">
          <div>
             <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-none mb-2 group-hover:text-[#0057FF] transition-colors duration-300">{experience.company}</h3>
             <h4 className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium">{experience.role}</h4>
          </div>
          
          <div className={`flex flex-wrap gap-6 text-sm font-mono opacity-60 uppercase tracking-wider ${isEven ? 'md:justify-end' : ''}`}>
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-[#0057FF]" /> {experience.period}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-[#0057FF]" /> {experience.location}
            </span>
          </div>

          <p className="text-lg leading-relaxed opacity-80 max-w-xl">
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
                className="px-3 py-1 text-xs font-bold border border-zinc-200 dark:border-zinc-800 rounded-sm uppercase tracking-wider hover:bg-[#0057FF] hover:text-white hover:border-[#0057FF] transition-colors cursor-default"
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