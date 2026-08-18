'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChatbotButton } from './ChatbotButton';
import { ChatWindow } from './ChatWindow';
import { ChatMessageItem } from './ChatMessage';
import { CHAT_FLOWS, matchUserQueryToFlow, QuickReplyOption, ChatNode } from './chatFlows';

export function ChatbotContainer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  // Initialize main menu welcome node
  const initWelcomeMessage = useCallback(() => {
    const mainNode = CHAT_FLOWS.mainMenu;
    const initialMsg: ChatMessageItem = {
      id: 'welcome-1',
      role: 'bot',
      text: mainNode.message,
      timestamp: formatTimestamp(),
      quickReplies: mainNode.quickReplies,
    };
    setMessages([initialMsg]);
  }, []);

  useEffect(() => {
    initWelcomeMessage();
  }, [initWelcomeMessage]);

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (option: QuickReplyOption) => {
    // If it's a direct page link
    if (option.action === 'link' && option.path) {
      handleNavigate(option.path);
      return;
    }

    // Otherwise it's a conversation node transition
    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: option.label,
      timestamp: formatTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const targetFlowId = option.flowId || 'mainMenu';
    const targetNode = CHAT_FLOWS[targetFlowId] || CHAT_FLOWS.mainMenu;

    setTimeout(() => {
      const botMsg: ChatMessageItem = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: targetNode.message,
        timestamp: formatTimestamp(),
        quickReplies: targetNode.quickReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 300);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: formatTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const matchResult = matchUserQueryToFlow(text);
      const botMsg: ChatMessageItem = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: matchResult.customText || matchResult.flowNode.message,
        timestamp: formatTimestamp(),
        quickReplies: matchResult.flowNode.quickReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 350);
  };

  const handleReset = () => {
    initWelcomeMessage();
  };

  const handleGoHome = () => {
    const mainNode = CHAT_FLOWS.mainMenu;
    const botMsg: ChatMessageItem = {
      id: `bot-${Date.now()}`,
      role: 'bot',
      text: mainNode.message,
      timestamp: formatTimestamp(),
      quickReplies: mainNode.quickReplies,
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <>
      <ChatbotButton onClick={() => setIsOpen(true)} isOpen={isOpen} />
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onSelectOption={handleSelectOption}
        onReset={handleReset}
        onGoHome={handleGoHome}
      />
    </>
  );
}
