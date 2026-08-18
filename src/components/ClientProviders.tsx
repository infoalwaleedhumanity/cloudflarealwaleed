'use client';

import React from 'react';
import { useSmoothScroll } from '@/lib/smoothScroll';
import Chatbot from '@/components/Chatbot';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useSmoothScroll();

  return (
    <>
      {children}
      <Chatbot />
    </>
  );
}
