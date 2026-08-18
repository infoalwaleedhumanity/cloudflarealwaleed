'use client';

import React from 'react';
import { ShieldCheck, RotateCcw, X } from 'lucide-react';
import { CHAT_CONFIG } from './chatConfig';

interface ChatHeaderProps {
  onReset: () => void;
  onClose: () => void;
}

export function ChatHeader({ onReset, onClose }: ChatHeaderProps) {
  return (
    <div className="px-5 py-4 bg-[var(--primary)] text-white flex items-center justify-between shrink-0 border-b border-white/10 shadow-xs select-none">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight leading-tight">
            {CHAT_CONFIG.botName}
          </h2>
          <p className="text-[11px] text-white/80 font-medium mt-0.5">
            {CHAT_CONFIG.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onReset}
          title={CHAT_CONFIG.resetTooltip}
          aria-label={CHAT_CONFIG.resetTooltip}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          title={CHAT_CONFIG.closeTooltip}
          aria-label={CHAT_CONFIG.closeTooltip}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

