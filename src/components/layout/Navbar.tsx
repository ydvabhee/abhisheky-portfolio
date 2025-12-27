'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Menu, X, ExternalLink } from 'lucide-react';
import metadata from '../../data/metadata.json';

const BoldLink: React.FC<{ children: string }> = ({ children }) => {
  return (
    <span className="inline-grid grid-cols-1 grid-rows-1 text-center">
      {/* Invisible bold text to reserve width */}
      <span className="invisible font-black row-start-1 col-start-1">{children}</span>
      {/* Visible text that changes weight */}
      <span className="visible font-medium group-hover:font-black row-start-1 col-start-1 transition-all duration-300">{children}</span>
    </span>
  );
};

const Navbar: React.FC<{ startAnimation?: boolean }> = ({ startAnimation = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={startAnimation ? { y: 0 } : { y: -100 }}
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 py-6 bg-white/80 dark:bg-black/80 backdrop-blur-sm text-black dark:text-white transition-colors duration-300 border-b border-black/5 dark:border-white/5"
      >
        <div className="flex items-center gap-2 z-50">
          <div className="rounded-full overflow-hidden w-10 h-10 relative">
            <Image 
              src={metadata.navbar.logo} 
              alt="Logo" 
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-8 text-sm font-medium">
            {metadata.navbar.links.map((link, index) => (
              <a key={index} href={link.href} className="group flex flex-col items-center">
                <BoldLink>{link.label}</BoldLink>
              </a>
            ))}
            <a 
              href={metadata.navbar.resume.href}
              target="_blank"
              rel="noopener noreferrer" 
              className="group flex items-center gap-2"
            >
              <ExternalLink size={16} />
              <BoldLink>{metadata.navbar.resume.label}</BoldLink>
            </a>
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden z-50 p-2"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white dark:bg-black text-black dark:text-white pt-24 px-6 md:hidden flex flex-col gap-8 transition-colors duration-300"
          >
            <div className="flex flex-col gap-6 text-2xl font-black uppercase tracking-tighter">
              {metadata.navbar.links.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="border-b border-black/10 dark:border-white/10 pb-4"
                >
                  {link.label}
                </a>
              ))}
              <a 
                href={metadata.navbar.resume.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4"
              >
                <ExternalLink size={24} />
                {metadata.navbar.resume.label}
              </a>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm font-mono opacity-50">Switch Theme</span>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;