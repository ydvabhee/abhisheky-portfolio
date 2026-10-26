'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import metadata from '@/data/metadata.json';
import { sentenceCase } from '@/lib/utils';
import { THEMES, setTheme, useThemeName } from '@/lib/themes';

const { logo, links, resume } = metadata.navbar;

function ThemeSwitcher({ className = '' }: { className?: string }) {
  const active = useThemeName();
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Object.values(THEMES).map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          aria-label={`Theme: ${t.label}`}
          aria-pressed={active === t.name}
          className={`grid h-[18px] w-[18px] place-items-center rounded-full border transition ${active === t.name ? 'border-fg ring-2 ring-fg/25' : 'border-fg/20 hover:border-fg/50'}`}
          style={{ background: t.swatch[0] }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.swatch[1] }} />
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <nav className="glass mx-auto flex max-w-[1600px] items-center justify-between rounded-full p-2">
        <a href="/#top" className="flex items-center gap-3 pr-2">
          <Image src={logo} alt="Home" width={36} height={36} className="rounded-full" priority />
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-fg/70 sm:block">
            {metadata.hero.firstName} {metadata.hero.middleName} {metadata.hero.lastName}
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm text-fg/70 transition hover:bg-fg/5 hover:text-fg">
              {sentenceCase(link.label)}
            </a>
          ))}
          <ThemeSwitcher className="mx-2" />
          <a
            href={resume.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:brightness-110"
          >
            {sentenceCase(resume.label)} <ArrowUpRight size={14} />
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="p-2 md:hidden" aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="glass mt-2 flex flex-col gap-1 rounded-3xl p-4 md:hidden">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-2xl font-medium tracking-tight">
              {sentenceCase(link.label)}
            </a>
          ))}
          <ThemeSwitcher className="px-4 py-3" />
          <a
            href={resume.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-1 rounded-full bg-accent px-4 py-3 font-medium text-accent-fg"
          >
            {sentenceCase(resume.label)} <ArrowUpRight size={16} />
          </a>
        </div>
      )}
    </header>
  );
}
