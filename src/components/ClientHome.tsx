'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './layout/Navbar';
import Hero from './sections/Hero';
import Work from './sections/Work';
import About from './sections/About';
import Contact from './sections/Contact';
import Preloader from './ui/Preloader';
import SplashCursor from './ui/SplashCursor';

export default function ClientHome() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <SplashCursor />
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      <div>
        <Navbar startAnimation={!loading} />
        <main>
          <Hero startAnimation={!loading} />
          <About />
          <Work />
          <Contact />
        </main>
      </div>
    </>
  );
}