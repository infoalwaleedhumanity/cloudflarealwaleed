'use client';

import { useState } from 'react';
import { Quote } from 'lucide-react';
import { C } from './ui';

interface Story {
  quote: string;
  name: string;
  location: string;
  program: string;
}

export default function TestimonialsCarousel({ stories }: { stories: Story[] }) {
  const [active, setActive] = useState(0);
  const current = stories[active];

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8">
      <Quote className="w-9 h-9 mx-auto" style={{ color: C.green }} />
      <div className="min-h-[130px] flex items-center justify-center">
        <p className="text-xl sm:text-2xl leading-relaxed" style={{ color: C.ink, fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
          {current.quote}
        </p>
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-black" style={{ color: C.green }}>
          {current.name}
        </h4>
        <p className="text-xs" style={{ color: C.muted }}>
          {current.location} ·{' '}
          <span className="font-bold" style={{ color: C.ink }}>
            {current.program}
          </span>
        </p>
      </div>
      <div className="flex justify-center gap-3 pt-2">
        {stories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className="transition-all duration-300 rounded-full cursor-pointer"
            style={
              active === idx
                ? { width: '2rem', height: '4px', backgroundColor: C.green }
                : { width: '8px', height: '4px', backgroundColor: C.border }
            }
            aria-label={`رأي رقم ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
