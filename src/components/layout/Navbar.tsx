import React from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';
import metadata from '../../data/metadata.json';

const Navbar: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-white/80 dark:bg-black/80 backdrop-blur-sm text-black dark:text-white transition-colors duration-300"
    >
      <div className="flex items-center gap-2">
        <img src={metadata.navbar.logo} alt="Logo" className="h-10 w-auto rounded-full" />
      </div>
      <div className="flex items-center space-x-8">
        <div className="flex space-x-8 text-sm font-medium">
          {metadata.navbar.links.map((link, index) => (
            <a key={index} href={link.href} className="hover:line-through transition-all">
              {link.label}
            </a>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </motion.nav>
  );
};

export default Navbar;
