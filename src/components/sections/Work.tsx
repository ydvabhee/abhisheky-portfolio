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
    <section id="work" className="py-24 px-4 md:px-8 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold tracking-tighter italic text-center mb-6"
          >
            EXPERIENCE
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="h-1 w-24 bg-white"
          />
        </div>

        <div ref={containerRef} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[2px] bg-zinc-800 -translate-x-1/2">
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute top-0 left-0 w-full h-full bg-white"
            />
          </div>

          <div className="space-y-12 md:space-y-24">
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
      <div className="absolute left-[19px] md:left-1/2 top-0 w-4 h-4 rounded-full bg-black border-[3px] border-white z-10 -translate-x-1/2 md:translate-y-6" />

      {/* Content Side */}
      <div className={`flex-1 pl-12 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-bold tracking-tight">{experience.company}</h3>
          <h4 className="text-xl text-zinc-400 font-medium">{experience.role}</h4>
          
          <div className={`flex flex-wrap gap-4 text-sm font-mono opacity-60 mt-2 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {experience.period}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {experience.location}
            </span>
          </div>

          <p className="text-zinc-300 leading-relaxed mb-6">
            {experience.description.map((point, i) => (
              <span key={i} className="block mb-2 last:mb-0">
                • {point}
              </span>
            ))}
          </p>

          <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : ''}`}>
            {experience.tech.map((tech, i) => (
              <span 
                key={i} 
                className="px-3 py-1 text-xs font-bold border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-colors cursor-default"
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