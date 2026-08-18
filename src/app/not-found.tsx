'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-black text-[var(--primary)] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-[var(--primary)]/80 mb-6">الصفحة غير موجودة</h2>
      <p className="text-slate-600 mb-8 max-w-md">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link
        href="/"
        className="px-8 py-4 bg-[var(--gold)] text-[var(--primary)] font-black rounded-full hover:bg-[var(--gold-light)] transition-all"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
