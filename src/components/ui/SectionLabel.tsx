export default function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-fg/50">
      <span className="text-accent">{n}</span>
      <span className="h-px w-8 bg-fg/20" />
      {children}
    </p>
  );
}
