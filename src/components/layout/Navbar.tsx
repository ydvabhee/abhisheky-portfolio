import React from 'react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-white/80 backdrop-blur-sm"
    >
      <div className="text-xl font-bold tracking-tighter">ABHISHEK</div>
      <div className="flex space-x-8 text-sm font-medium">
        <a href="#work" className="hover:line-through transition-all">WORK</a>
        <a href="#about" className="hover:line-through transition-all">ABOUT</a>
        <a href="#contact" className="hover:line-through transition-all">CONTACT</a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
