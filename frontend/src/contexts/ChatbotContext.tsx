'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import ChatWindow from '../../chatbot/ChatWindow';
import ChatbotButton from '../../chatbot/ChatbotButton';

interface ChatbotContextType {
  isChatbotOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { user } = useAuth();

  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);
  const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);

  const value = {
    isChatbotOpen,
    openChatbot,
    closeChatbot,
    toggleChatbot,
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
      {/* Render the chatbot components here */}
      <ChatbotButton
        onClick={openChatbot}
        hasUnread={false}
      />
      <ChatWindow
        isOpen={isChatbotOpen}
        onClose={closeChatbot}
        userId={user.id || ''}
        apiUrl={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
      />
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};