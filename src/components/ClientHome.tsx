'use client';

import dynamic from 'next/dynamic';
import Navbar from './layout/Navbar';
import Hero from './sections/Hero';
import Work from './sections/Work';
import About from './sections/About';
import Hobbies from './sections/Hobbies';
import Contact from './sections/Contact';

// three.js stays out of SSR and the initial bundle
const Scene = dynamic(() => import('./three/Scene'), { ssr: false });

export default function ClientHome() {
  return (
    <>
      <Scene />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Work />
        <Hobbies />
        <Contact />
      </main>
    </>
  );
}
