'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import metadata from '@/data/metadata.json';
import SectionLabel from '../ui/SectionLabel';

const { work } = metadata;
const pad = (n: number) => String(n).padStart(2, '0');

export default function Work() {
  return (
    <section id="work" className="relative px-6 pt-32 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel n="02">{work.title}</SectionLabel>
        <h2 className="mt-6 text-[clamp(2.5rem,6vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
          A journey of <span className="font-serif font-normal italic tracking-[-0.02em] text-accent">growth.</span>
        </h2>
      </div>

      {/* Each card is a camera stop for the 3D scene */}
      {work.experiences.map((exp, i) => (
        <article key={exp.id} data-scene className="flex min-h-svh items-center py-6 md:py-16">
          <div className={`mx-auto flex w-full max-w-[1600px] ${i % 2 ? 'md:justify-end' : ''}`}>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="glass w-full rounded-3xl md:w-[min(46%,640px)] md:p-10 p-5"
            >
              <div className="flex justify-between gap-4 font-mono text-xs uppercase tracking-[0.2em] text-fg/50">
                <span>
                  {pad(i + 1)} / {pad(work.experiences.length)}
                </span>
                <span>{exp.period}</span>
              </div>

              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:mt-8 md:text-5xl">
                <a href={exp.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 transition hover:text-accent">
                  {exp.company}
                  <ArrowUpRight size={28} className="opacity-40 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
                </a>
              </h3>
              <p className="mt-2 font-serif text-2xl italic text-accent">{exp.role}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-fg/40">{exp.location}</p>

              <ul className="mt-4 space-y-2 text-sm leading-snug md:mt-8 md:space-y-3 md:text-base md:leading-relaxed text-fg/70">
                {exp.description.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>

              <ul className="mt-4 flex flex-wrap gap-1.5 md:mt-8 md:gap-2">
                {exp.tech.map((tech) => (
                  <li key={tech} className="rounded-full border border-fg/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-fg/60">
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </article>
      ))}
    </section>
  );
}
