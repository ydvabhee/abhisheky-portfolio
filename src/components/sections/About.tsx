'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import metadata from '@/data/metadata.json';
import { sentenceCase } from '@/lib/utils';
import SectionLabel from '../ui/SectionLabel';

const { about } = metadata;

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

// Words light up one by one as the paragraph scrolls through the viewport
function RevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-fg/40">{title}</h3>
      <ul className="space-y-2 text-sm text-fg/80">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" data-scene className="relative flex min-h-svh items-center px-6 py-32 md:px-12">
      <div className="mx-auto grid w-full max-w-[1600px] md:grid-cols-2">
        <div className="glass rounded-3xl p-8 md:col-start-2 md:p-10">
          <SectionLabel n="01">{about.title}</SectionLabel>

          <RevealText
            text={sentenceCase(about.headline)}
            className="mt-8 text-3xl font-medium leading-[1.1] tracking-[-0.03em] md:text-[2.25rem]"
          />

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <Image
              src={about.profileImage}
              alt="Abhishek K Yadav"
              width={112}
              height={112}
              className="h-28 w-28 shrink-0 rounded-2xl object-cover grayscale transition duration-700 hover:grayscale-0"
            />
            <div className="space-y-4 leading-relaxed text-fg/65">
              {about.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8 border-t border-fg/10 pt-8">
            <List title={about.skillsTitle} items={about.skills} />
            <List title={about.certificationsTitle} items={about.certifications} />
          </div>
        </div>
      </div>
    </section>
  );
}
