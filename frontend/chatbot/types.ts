// TypeScript interfaces for chatbot components

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  conversationId: string;
  status: 'sending' | 'sent' | 'delivered' | 'error';
}

export interface ConversationState {
  conversationId: string;
  messages: ChatMessage[];
  isActive: boolean;
  lastActive: Date;
}

export interface ChatConfig {
  domainKey: string;
  apiEndpoint: string;
  authToken: string;
  userId: string;
}

export interface ChatWindowState {
  isOpen: boolean;
  isLoading: boolean;
  messages: ChatMessage[];
  inputValue: string;
  error: string | null;
  conversationId: string | null;
}

export interface ChatbotButtonState {
  isVisible: boolean;
  hasUnread: boolean;
  position: { bottom: string; right: string };
}