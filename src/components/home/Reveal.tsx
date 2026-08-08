'use client';

import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Use 'div' for a block that isn't semantically a <section>. */
  as?: 'section' | 'div';
}

// Wraps server-rendered children in a fade/slide-in-on-scroll animation.
// Only this thin wrapper ships as client JS — the content inside
// (headings, cards, images) stays part of the server-rendered HTML.
export default function Reveal({ children, className, style, as = 'section' }: RevealProps) {
  const MotionTag = as === 'div' ? motion.div : motion.section;
  return (
    <MotionTag
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}
