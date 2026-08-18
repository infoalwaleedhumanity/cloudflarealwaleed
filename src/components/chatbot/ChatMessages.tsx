'use client';

import React, { useRef, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { ChatMessage, ChatMessageItem } from './ChatMessage';
import { QuickReplyOption } from './chatFlows';
import { CHAT_CONFIG } from './chatConfig';

interface ChatMessagesProps {
  messages: ChatMessageItem[];
  isTyping: boolean;
  onSelectOption: (option: QuickReplyOption) => void;
}

export function ChatMessages({ messages, isTyping, onSelectOption }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[var(--background)] dir-rtl custom-scrollbar"
    >
      {/* Informational Guidance Banner */}
      <div className="p-3 rounded-xl bg-white border border-[var(--border)] text-[11px] text-[var(--text)] flex items-center gap-2 shadow-2xs leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-[var(--primary)] shrink-0" />
        <span>
          خدمة توجيه استرشادية لمساعدتكم في الوصول للخدمات الرسمية بمرونة وسهولة.
        </span>
      </div>

      {/* Render All Chat Messages */}
      {messages.map((msg, index) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          onSelectOption={onSelectOption}
          isLatestBotMessage={index === messages.length - 1 && msg.role === 'bot'}
        />
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-2 text-xs text-[var(--text)] my-1">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 border border-[var(--primary)]/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="px-3.5 py-2.5 rounded-2xl bg-white border border-[var(--border)] flex items-center gap-2 shadow-2xs">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce"
                style={{ animationDelay: '0.15s' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce"
                style={{ animationDelay: '0.3s' }}
              />
            </div>
            <span className="text-[11px] font-medium text-[var(--text)]">
              {CHAT_CONFIG.typingText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

