import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react'; // Assuming we're using Vercel's AI SDK which works with OpenAI ChatKit
import { AuthWrapper } from './auth-wrapper';
import { ConversationStateManager } from './conversation-state';
import './chatbot.css';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  apiUrl: string;
  domainKey: string; // For OpenAI ChatKit
}

const ChatWindowWithChatKit: React.FC<ChatWindowProps> = ({ isOpen, onClose, userId, apiUrl, domainKey }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const authWrapper = AuthWrapper.getInstance();
  const conversationManager = new ConversationStateManager();

  // Using Vercel's useChat hook which works with OpenAI-compatible APIs
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isAIMessageLoading,
    error: aiError,
    stop,
    reload,
    data
  } = useChat({
    body: {
      userId,
      conversationId: conversationId || undefined
    },
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('better-auth-token') || ''}`,
    },
    onResponse: (response) => {
      // Handle response from the API
      if (response.status >= 400) {
        setError('Failed to get response from AI');
      }
    },
    onError: (error) => {
      setError(error.message);
    },
    onFinish: (message) => {
      // Save the conversation when a message is finished
      if (conversationId) {
        // Update conversation with new messages
        const conversationState = conversationManager.loadConversationState(conversationId);
        if (conversationState) {
          conversationManager.saveConversationState(conversationId, {
            ...conversationState,
            messages: [...conversationState.messages],
            lastActive: new Date()
          });
        }
      }
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`chatbot-window ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="chatbot-header">
        <h3>AI Assistant</h3>
        <button className="chatbot-close" onClick={handleClose}>
          ×
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.length === 0 && (
          <div className="message assistant">
            Hello! How can I help you manage your tasks today?
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
          >
            {message.content}
          </div>
        ))}

        {isAIMessageLoading && (
          <div className="message assistant">
            <span className="loading-indicator"></span>
          </div>
        )}

        {error && (
          <div style={{ padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
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
          />
          <button
            type="submit"
            className="chatbot-send-button"
            disabled={isAIMessageLoading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindowWithChatKit;