'use client';
import { motion } from 'framer-motion';
import metadata from '@/data/metadata.json';
import SectionLabel from '../ui/SectionLabel';

const { hobbies } = metadata;
const words = hobbies.headline.split(' ');
const last = words.pop();

export default function Hobbies() {
  return (
    <section id="hobbies" className="relative px-6 pt-32 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel n="03">{hobbies.title}</SectionLabel>
        <h2 className="mt-6 text-[clamp(2.5rem,6vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
          {words.join(' ')} <span className="font-serif font-normal italic tracking-[-0.02em] text-accent">{last}</span>
        </h2>
      </div>

      {/* Each card is a camera stop for the 3D scene */}
      {hobbies.items.map((item, i) => (
        <article key={item.name} data-scene className="flex min-h-svh items-end py-6 md:items-center md:py-16">
          <div className={`mx-auto flex w-full max-w-[1600px] ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="glass w-full rounded-3xl p-8 md:w-[min(40%,520px)] md:p-10"
            >
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-fg/50">
                0{i + 1} / 0{hobbies.items.length}
              </div>
              <h3 className="mt-6 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{item.name}</h3>
              <p className="mt-4 text-lg text-fg/70">{item.line}</p>
            </motion.div>
          </div>
        </article>
      ))}
    </section>
  );
}
