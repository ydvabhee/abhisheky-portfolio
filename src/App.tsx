import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Work from './components/sections/Work';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import Preloader from './components/ui/Preloader';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      {!loading && (
        <div className="min-h-screen bg-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Work />
            <Contact />
          </main>
        </div>
      )}
    </>
  );
}

export default App;