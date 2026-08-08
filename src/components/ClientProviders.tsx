'use client';

import React from 'react';
import { useSmoothScroll } from '@/lib/smoothScroll';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useSmoothScroll();

  return <>{children}</>;
}
