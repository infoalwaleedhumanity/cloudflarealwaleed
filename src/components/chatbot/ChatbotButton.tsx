'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import { CHAT_CONFIG } from './chatConfig';

interface ChatbotButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatbotButton({ onClick, isOpen }: ChatbotButtonProps) {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          type="button"
          initial={{ scale: 0.3, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.3, opacity: 0, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ transformOrigin: 'bottom right' }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClick}
          aria-label="المساعد الرقمي"
          className="fixed bottom-6 right-6 z-[9990] flex items-center justify-center w-14 h-14 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white shadow-[0_10px_30px_rgba(var(--primary-rgb),0.35)] border border-white/20 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/30 select-none group"
        >
          <div className="relative flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
