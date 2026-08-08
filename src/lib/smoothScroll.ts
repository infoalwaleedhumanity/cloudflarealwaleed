import { useEffect } from 'react';

export function useSmoothScroll() {
  useEffect(() => {
    // Enable smooth scrolling natively
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
}

