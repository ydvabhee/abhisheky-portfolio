import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import metadata from '../../data/metadata.json';

const Work: React.FC = () => {
  return (
    <section id="work" className="py-32 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 border-t border-black/10 dark:border-white/10">
      <div className="max-w-[100rem] mx-auto">
        
        {/* Header */}
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/10 dark:border-white/10 pb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] uppercase"
          >
            {metadata.work.title}
          </motion.h2>
          <div className="text-right hidden md:block pb-2">
            <span className="text-xs font-mono uppercase tracking-widest opacity-50">Career History</span>
          </div>
        </div>

        {/* Experience List (Grid Layout) */}
        <div className="flex flex-col">
          {metadata.work.experiences.map((exp, index) => (
            <ExperienceItem key={exp.id} experience={exp} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

type Experience = typeof metadata.work.experiences[0];

const ExperienceItem: React.FC<{ experience: Experience, index: number }> = ({ experience, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group border-b border-black/10 dark:border-white/10 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300 -mx-4 px-4 md:-mx-8 md:px-8"
    >
      
      {/* Col 1: Period & Location (Desktop: 3 cols) */}
      <div className="md:col-span-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-60">
           <Calendar size={12} />
           <span>{experience.period}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-40">
           <MapPin size={12} />
           <span>{experience.location}</span>
        </div>
      </div>

      {/* Col 2: Company & Role (Desktop: 4 cols) */}
      <div className="md:col-span-4 flex flex-col gap-1">
         <h3 className="text-3xl md:text-4xl font-bold tracking-tight uppercase group-hover:translate-x-2 transition-transform duration-300 ease-out">
           {experience.company}
         </h3>
         <h4 className="text-lg md:text-xl font-medium opacity-60">
           {experience.role}
         </h4>
      </div>

      {/* Col 3: Description & Tech (Desktop: 5 cols) */}
      <div className="md:col-span-5 flex flex-col gap-6">
         <div className="opacity-80 text-base md:text-lg leading-relaxed space-y-2">
            {experience.description.map((point, i) => (
              <p key={i} className="flex gap-3">
                <span className="opacity-30 mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                <span>{point}</span>
              </p>
            ))}
         </div>

         <div className="flex flex-wrap gap-2 pt-2">
            {experience.tech.map((tech, i) => (
              <span 
                key={i} 
                className="px-3 py-1 text-[10px] font-bold border border-black/10 dark:border-white/10 rounded-full uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
         </div>
      </div>

    </motion.div>
  );
};

export default Work;