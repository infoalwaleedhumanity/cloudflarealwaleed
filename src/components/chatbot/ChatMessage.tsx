'use client';

import React from 'react';
import { ShieldCheck, User } from 'lucide-react';
import { QuickReplyOption } from './chatFlows';
import { QuickReplies } from './QuickReplies';

export interface ChatMessageItem {
  id: string;
  role: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: QuickReplyOption[];
}

interface ChatMessageProps {
  message: ChatMessageItem;
  onSelectOption: (option: QuickReplyOption) => void;
  isLatestBotMessage?: boolean;
}

export function ChatMessage({ message, onSelectOption, isLatestBotMessage }: ChatMessageProps) {
  const isBot = message.role === 'bot';

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <React.Fragment key={lineIdx}>
          {lineIdx > 0 && <br />}
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-bold text-inherit">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </React.Fragment>
      );
    });
  };

  // Ensure bot response messages (except the main menu itself) always include "الرجوع للقائمة الرئيسية"
  const isMainMenuMessage =
    message.text.includes('كيف يمكننا مساعدتكم') ||
    message.quickReplies?.some((opt) => opt.id === 'm_apply');

  const hasMainMenuOption = message.quickReplies?.some(
    (opt) => opt.flowId === 'mainMenu' || opt.label.includes('الرئيسية')
  );

  let displayQuickReplies = message.quickReplies ? [...message.quickReplies] : [];
  if (isBot && !isMainMenuMessage && !hasMainMenuOption) {
    displayQuickReplies.push({
      id: `main-return-${message.id}`,
      label: 'الرجوع للقائمة الرئيسية',
      flowId: 'mainMenu',
    });
  }

  return (
    <div className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'} my-1`}>
      {isBot && (
        <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4" />
        </div>
      )}

      <div className="max-w-[88%] space-y-2">
        <div
          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-cairo transition-colors ${
            isBot
              ? 'bg-white text-[var(--text)] border border-[var(--border)] rounded-tr-xs shadow-2xs'
              : 'bg-[var(--primary)] text-white font-medium rounded-tl-xs shadow-2xs'
          }`}
        >
          <div>{renderFormattedText(message.text)}</div>
          <span
            className={`block text-[10px] mt-1.5 ${
              isBot ? 'text-[var(--text)] text-right' : 'text-white/80 text-left'
            }`}
          >
            {message.timestamp}
          </span>
        </div>

        {/* Quick actions associated with institutional service responses */}
        {isBot && displayQuickReplies.length > 0 && (
          <QuickReplies
            options={displayQuickReplies}
            onSelectOption={onSelectOption}
          />
        )}
      </div>

      {!isBot && (
        <div className="w-7 h-7 rounded-lg bg-[var(--text)] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <User className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}

