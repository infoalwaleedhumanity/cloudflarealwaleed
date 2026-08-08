'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Instant scroll to top on route change without animation delay
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  return (
    <div key={pathname} className="w-full flex-grow flex flex-col min-h-full">
      {children}
    </div>
  );
}

