import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { AuthWrapper } from './auth-wrapper';
import { ConversationStateManager } from './conversation-state';
import './chatbot.css';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  apiUrl: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, userId, apiUrl }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const authWrapper = AuthWrapper.getInstance();
  const conversationManager = new ConversationStateManager();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isAIMessageLoading,
    error: aiError,
    setMessages
  } = useChat({
    api: `${apiUrl}/api/${userId}/chat`,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('better-auth-token') || ''}`,
      'Content-Type': 'application/json',
    },
    body: {
      userId: userId,
      conversationId: conversationManager.getActiveConversationId() || null,
    },
    onResponse: (response) => {
      if (response.status >= 400) {
        setError('Failed to get response from AI');
      }
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // Check if mobile to set fullscreen mode
  useEffect(() => {
    const checkMobile = () => {
      setIsFullscreen(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Focus input when window opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleClose = () => {
    onClose();
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`chatbot-window ${isFullscreen ? 'fullscreen' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-window-title"
    >
      <div className="chatbot-header">
        <h3 id="chat-window-title">AI Assistant</h3>
        <button
          className="chatbot-close"
          onClick={handleClose}
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      <div
        className="chatbot-messages"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 && !isAIMessageLoading && (
          <div
            className="message assistant"
            role="status"
            aria-live="polite"
          >
            Hello! How can I help you manage your tasks today?
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
            aria-label={`${message.role} said: ${message.content}`}
          >
            {message.content}
          </div>
        ))}

        {isAIMessageLoading && (
          <div
            className="message assistant"
            role="status"
            aria-live="assertive"
          >
            <span
              className="loading-indicator"
              aria-label="Loading response"
            ></span>
          </div>
        )}

        {error && (
          <div
            style={{ padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-area">
        <form onSubmit={handleFormSubmit} className="w-full flex gap-2">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input flex-1"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isAIMessageLoading}
            aria-label="Type your message"
            autoComplete="off"
          />
          <button
            type="submit"
            className="chatbot-send-button"
            disabled={isAIMessageLoading || !input.trim()}
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;