'use client';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import metadata from '@/data/metadata.json';
import { sentenceCase } from '@/lib/utils';

const { hero } = metadata;
const ease = [0.22, 1, 0.36, 1] as const;

// Masked line that slides up into place
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay, ease }}>
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  return (
    <section id="top" data-scene className="relative flex min-h-svh flex-col justify-end px-6 pb-10 pt-32 md:px-12">
      <div className="mx-auto w-full max-w-[1600px]">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] text-fg/60 md:tracking-[0.25em]"
        >
          <span className="h-2 w-2 rounded-full bg-accent" />
          {hero.role} — {hero.subRole}
        </motion.p>

        <h1 className="text-[clamp(3.5rem,11vw,11.5rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
          <Line delay={0.1}>{sentenceCase(hero.firstName)}</Line>
          <Line delay={0.2}>
            <span className="font-serif font-normal italic tracking-[-0.02em] text-accent">{hero.middleName}</span>{' '}
            {sentenceCase(hero.lastName)}
          </Line>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease }}
          className="mt-12 grid gap-8 border-t border-fg/10 pt-6 md:grid-cols-12 md:items-end"
        >
          <p className="text-lg leading-relaxed text-fg/70 md:col-span-5">{hero.description}</p>
          <div className="font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-fg/50 md:col-span-3 md:col-start-7">
            <p>{hero.location}</p>
            <p>{hero.coordinates}</p>
          </div>
          <a href="#work" className="group flex items-center gap-3 text-sm md:col-span-3 md:col-start-10 md:justify-self-end">
            {hero.cta}
            <span className="grid h-11 w-11 place-items-center rounded-full border border-fg/20 transition group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg">
              <ArrowDown size={16} />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
