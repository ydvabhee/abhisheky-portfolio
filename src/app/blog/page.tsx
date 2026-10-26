import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function BlogIndex() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 pt-40 md:px-12">
        <h1 className="mb-12 text-6xl font-semibold tracking-[-0.05em]">
          Writing<span className="text-accent">.</span>
        </h1>
        <div className="border-t border-fg/10 py-12">
          <p className="text-xl text-fg/60">Articles coming soon.</p>
        </div>
        <Link href="/" className="mt-8 inline-block border-b border-fg pb-1 font-mono text-xs uppercase tracking-[0.2em] transition hover:border-accent hover:text-accent">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
