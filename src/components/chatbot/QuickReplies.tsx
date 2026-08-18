'use client';

import React from 'react';
import { ExternalLink, ChevronLeft, Home } from 'lucide-react';
import { QuickReplyOption } from './chatFlows';

interface QuickRepliesProps {
  options: QuickReplyOption[];
  onSelectOption: (option: QuickReplyOption) => void;
  disabled?: boolean;
}

export function QuickReplies({ options, onSelectOption, disabled }: QuickRepliesProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-1 max-w-full">
      {options.map((opt) => {
        const isLink = opt.action === 'link';
        const isMainMenu = opt.flowId === 'mainMenu' || opt.label.includes('الرئيسية');

        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectOption(opt)}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs text-right select-none ${
              isLink
                ? 'bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white border border-[var(--primary)]'
                : isMainMenu
                ? 'bg-[var(--background)] hover:bg-[var(--background)] text-[var(--primary)] border border-[var(--primary)]/30 hover:border-[var(--primary)]'
                : 'bg-white hover:bg-[var(--background)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)]/40'
            } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
          >
            {isMainMenu && <Home className="w-3.5 h-3.5 shrink-0 text-[var(--primary)]" />}
            <span>{opt.label}</span>
            {isLink ? (
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-90" />
            ) : !isMainMenu ? (
              <ChevronLeft className="w-3.5 h-3.5 shrink-0 opacity-60 text-[var(--primary)]" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

