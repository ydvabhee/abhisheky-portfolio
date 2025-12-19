import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Work from './components/sections/Work';
import About from './components/sections/About';
import Contact from './components/sections/Contact';

function App() {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Work />
        <About />
        <Contact />
      </main>
    </div>
  );
}

export default App;