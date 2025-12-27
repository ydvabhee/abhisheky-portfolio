'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import metadata from '../../data/metadata.json';
import Crosshair from '../ui/Crosshair';

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative py-32 px-8 bg-white dark:bg-black text-black dark:text-white border-t border-black/10 dark:border-white/10 transition-colors duration-500 overflow-hidden"
    >
      <Crosshair color="currentColor" containerRef={containerRef} selector=".email-target" />
      <div className="flex flex-col items-center text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[12vw] font-black leading-none tracking-tighter mb-12 uppercase whitespace-pre-line"
        >
          {metadata.contact.title}
        </motion.h2>
        
        <a 
          href={`mailto:${metadata.contact.email}`}
          className="email-target text-3xl md:text-5xl font-medium hover:line-through transition-all mb-20 block"
        >
          {metadata.contact.email}
        </a>

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-black/10 dark:border-white/10">
          <div className="flex space-x-8">
            <a href={metadata.contact.linkedin.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold tracking-widest hover:opacity-50 uppercase">
              {metadata.contact.linkedin.label} <ArrowUpRight size={14} />
            </a>
          </div>
          <p className="text-[10px] opacity-40 uppercase tracking-[0.3em]">
            {metadata.contact.copyright}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
