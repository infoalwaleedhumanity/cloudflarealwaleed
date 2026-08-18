'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Home, CheckCircle2 } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatMessageItem } from './ChatMessage';
import { QuickReplyOption, CHAT_FLOWS } from './chatFlows';
import { CHAT_CONFIG } from './chatConfig';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessageItem[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onSelectOption: (option: QuickReplyOption) => void;
  onReset: () => void;
  onGoHome: () => void;
}

export function ChatWindow({
  isOpen,
  onClose,
  messages,
  isTyping,
  onSendMessage,
  onSelectOption,
  onReset,
  onGoHome,
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-label="نافذة المساعد الرقمي لمؤسسة الوليد للإنسانية"
          initial={{ opacity: 0, scale: 0.25, y: 35, x: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.15, y: 45, x: 20 }}
          style={{ transformOrigin: 'bottom right' }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="chat-window-container fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-[9995] w-auto sm:w-[400px] h-[580px] max-h-[82vh] sm:max-h-[85vh] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-[var(--border)] overflow-hidden flex flex-col font-cairo dir-rtl"
        >
          {/* Header */}
          <ChatHeader onReset={onReset} onClose={onClose} />

          {/* Messages List Container */}
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            onSelectOption={onSelectOption}
          />

          {/* Footer Input Area */}
          <div className="p-3 bg-white border-t border-[var(--border)] shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <button
                type="button"
                onClick={onGoHome}
                title="القائمة الرئيسية"
                aria-label="الانتقال للقائمة الرئيسية"
                className="w-10 h-10 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--background)] text-[var(--text)] hover:text-[var(--primary)] flex items-center justify-center shrink-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
              >
                <Home className="w-4 h-4" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={CHAT_CONFIG.inputPlaceholder}
                disabled={isTyping}
                aria-label="اكتب استفسارك هنا"
                className="flex-1 bg-[var(--background)] text-[var(--text)] placeholder-[var(--text)]/60 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-colors font-cairo"
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="إرسال الاستفسار"
                className="w-10 h-10 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
              >
                <Send className="w-4 h-4 -scale-x-100" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--text)] font-medium px-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[var(--primary)]" />
                نظام آلي استرشادي بدون ذكاء اصطناعي
              </span>
              <button
                type="button"
                onClick={onGoHome}
                className="text-[var(--primary)] hover:underline font-bold cursor-pointer"
              >
                القائمة الرئيسية ←
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
