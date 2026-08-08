import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/* =============================================================
   DESIGN TOKENS
   Matched to the foundation's real brand: white field, deep
   institutional green (#00833D from the live site's own
   theme-color), warm ink text. Light, spacious, editorial —
   not a dark "luxury" treatment.
   ============================================================= */
export const C = {
  green: '#00833D',
  greenDark: '#00612D',
  greenSoft: 'rgba(0,131,61,0.08)',
  ink: '#111110',
  muted: '#5B5B56',
  bg: '#FFFFFF',
  bgSoft: '#F6F6F3',
  border: '#E7E5DF',
};

export const WIDE = 'max-w-[1320px] w-full mx-auto px-6 md:px-10 lg:px-14';

// Plain functions, no hooks — safe to call from a Server Component
// (page.tsx) or from any Client island alike.

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-black tracking-[0.2em]" style={{ color: C.green }}>
      {children}
    </span>
  );
}

export function Kicker({
  eyebrow,
  title,
  description,
  align = 'start',
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
  action?: React.ReactNode;
}) {
  const isCenter = align === 'center';
  return (
    <div
      className={`flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-right'} gap-4 ${
        action ? 'md:flex-row md:items-end md:justify-between md:text-right' : ''
      }`}
    >
      <div className="space-y-3 max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight" style={{ color: C.ink }}>
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: C.muted }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

// href-only by design: a plain <Link> needs no client boundary, so this
// stays usable straight from the server page. `onClick` is only ever
// exercised when a Client island calls this (e.g. to close a modal
// before navigating) — see note in the README/summary.
export function TextLink({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group inline-flex items-center gap-2 text-sm font-black pb-0.5 border-b-2 transition-colors cursor-pointer shrink-0"
      style={{ color: C.green, borderColor: C.green }}
    >
      <span>{children}</span>
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
    </Link>
  );
}

export function SolidButton({
  children,
  href,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  href: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2.5 rounded-md px-8 py-4 text-sm font-black transition-all duration-300 cursor-pointer hover:brightness-110 ${className}`}
      style={{ backgroundColor: C.green, color: '#fff' }}
    >
      {children}
    </Link>
  );
}
