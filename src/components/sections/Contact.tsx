import { ArrowUp, ArrowUpRight } from 'lucide-react';
import metadata from '@/data/metadata.json';
import SectionLabel from '../ui/SectionLabel';

const { contact, navbar } = metadata;
const [line1, line2] = contact.title.split('\n').map((s) => s.trim());

const pill = 'flex items-center gap-1 rounded-full border border-fg/15 px-5 py-2.5 text-sm transition hover:border-accent hover:text-accent';

export default function Contact() {
  return (
    <section id="contact" data-scene className="relative flex min-h-svh flex-col px-6 pb-8 pt-32 md:px-12">
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center justify-center text-center">
        <SectionLabel>Contact</SectionLabel>

        <h2 className="mt-8 text-[clamp(3.5rem,12vw,12rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
          {line1}
          <br />
          <span className="font-serif font-normal italic tracking-[-0.02em] text-accent">{line2}</span>
        </h2>

        <a href={`mailto:${contact.email}`} className="group relative mt-12 text-2xl tracking-tight md:text-4xl">
          {contact.email}
          <span className="absolute inset-x-0 -bottom-2 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
        </a>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={contact.linkedin.url} target="_blank" rel="noopener noreferrer" className={pill}>
            {contact.linkedin.label} <ArrowUpRight size={14} />
          </a>
          <a href={navbar.resume.href} target="_blank" rel="noopener noreferrer" className={pill}>
            Resume <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <footer className="mx-auto mt-16 flex w-full max-w-[1600px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-fg/10 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-fg/60">
        <span>{contact.copyright}</span>
        <a href="#top" className="flex items-center gap-1 whitespace-nowrap transition hover:text-fg">
          Back to top <ArrowUp size={12} />
        </a>
      </footer>
    </section>
  );
}
