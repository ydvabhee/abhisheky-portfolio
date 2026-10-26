export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-fg/50">{children}</p>
  );
}
