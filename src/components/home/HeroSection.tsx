'use client';

import { useRouter } from 'next/navigation';
import { Hero } from '@/components/home/Hero';

const pageToPath: Record<string, string> = {
  home: '/',
  about: '/about',
  vision: '/vision',
  goals: '/goals',
  programs: '/programs',
  projects: '/projects',
  news: '/news',
  faq: '/faq',
  apply: '/apply',
  track: '/track',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
};

// Hero is unchanged — it still receives the same `navigate(page: string)`
// contract it always did. Only the router hook moves into this tiny
// client boundary instead of forcing the whole homepage to be client.
export default function HeroSection() {
  const router = useRouter();

  const navigate = (page: string) => {
    router.push(pageToPath[page] || '/');
  };

  return <Hero navigate={navigate} />;
}
