import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 px-8 bg-white dark:bg-black text-black dark:text-white border-t border-black/10 dark:border-white/10 transition-colors duration-500">
      <div className="flex flex-col items-center text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[12vw] font-black leading-none tracking-tighter mb-12 uppercase"
        >
          Let's work <br />together
        </motion.h2>
        
        <a 
          href="mailto:yk.abhee@gmail.com" 
          className="text-3xl md:text-5xl font-medium hover:line-through transition-all mb-20 block"
        >
          yk.abhee@gmail.com
        </a>

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-black/10 dark:border-white/10">
          <div className="flex space-x-8">
            <a href="https://www.linkedin.com/in/ydvabhee" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold tracking-widest hover:opacity-50 uppercase">
              LinkedIn <ArrowUpRight size={14} />
            </a>
          </div>
          <p className="text-[10px] opacity-40 uppercase tracking-[0.3em]">
            © 2025 Abhishek K Yadav. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
