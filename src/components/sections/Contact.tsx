import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 px-8 bg-white text-black border-t border-zinc-200">
      <div className="flex flex-col items-center text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[8vw] font-black leading-none tracking-tighter mb-12"
        >
          LET'S WORK <br />TOGETHER
        </motion.h2>
        
        <a 
          href="mailto:yk.abhee@gmail.com" 
          className="text-3xl md:text-5xl font-medium hover:line-through transition-all mb-20 block"
        >
          yk.abhee@gmail.com
        </a>

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-zinc-100">
          <div className="flex space-x-8">
            <a href="https://www.linkedin.com/in/ydvabhee" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-bold hover:opacity-50">
              LINKEDIN <ArrowUpRight size={14} />
            </a>
          </div>
          <p className="text-xs opacity-40 uppercase tracking-widest">
            © 2025 ABHISHEK K YADAV. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;