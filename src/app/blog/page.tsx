import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar startAnimation={false} />
      <div className="pt-32 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="text-6xl font-black mb-12 tracking-tighter">Writing</h1>
        <div className="border-t border-black/10 dark:border-white/10 py-12">
          <p className="text-xl opacity-60 font-medium">Articles coming soon.</p>
        </div>
        <Link href="/" className="inline-block mt-8 text-sm font-bold uppercase tracking-widest border-b border-black dark:border-white pb-1 hover:opacity-50 transition-opacity">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
