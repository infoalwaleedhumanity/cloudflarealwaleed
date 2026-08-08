'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { C } from './ui';

interface Faq {
  question: string;
  answer: string;
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <div className="divide-y" style={{ borderColor: C.border }}>
      {faqs.map((faq, idx) => {
        const isOpen = activeFaq === idx;
        return (
          <div key={idx} className="border-t first:border-t-0" style={{ borderColor: C.border }}>
            <button
              onClick={() => setActiveFaq(isOpen ? null : idx)}
              className="w-full py-6 text-right flex items-center justify-between gap-4 font-black transition-colors cursor-pointer"
              style={{ color: isOpen ? C.green : C.ink }}
              aria-expanded={isOpen}
            >
              <span className="text-base sm:text-lg">{faq.question}</span>
              <ChevronDown
                className="w-5 h-5 shrink-0 transition-transform duration-300"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'none', color: C.green }}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="pb-6 text-sm leading-relaxed" style={{ color: C.muted }}>
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
