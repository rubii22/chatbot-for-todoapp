import React, { useState, useEffect, useRef } from 'react';
import { AuthWrapper } from './auth-wrapper';
import { ConversationStateManager } from './conversation-state';
import './chatbot.css';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  apiUrl: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  conversationId: string;
  status: 'sending' | 'sent' | 'delivered' | 'error';
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, userId, apiUrl }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const authWrapper = AuthWrapper.getInstance();
  const conversationManager = new ConversationStateManager();

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

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      conversationId: conversationId || '',
      status: 'sending'
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get auth token
      const token = await authWrapper.getToken();

      // Check if we're dealing with a guest user and no token exists
      if (userId === 'guest' && !token) {
        // For guest users without auth, we might need to handle differently
        // or show a message that they need to log in for full functionality
        console.warn('Guest user attempting to use chat - authentication required');
      }

      // Construct the API URL properly
      let endpointUrl = '';
      if (apiUrl.endsWith('/')) {
        endpointUrl = `${apiUrl}api/${userId}/chat`;
      } else {
        endpointUrl = `${apiUrl}/api/${userId}/chat`;
      }

      // Send message to backend
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Only add auth header if token exists
        },
        body: JSON.stringify({
          message: inputValue,
          conversation_id: conversationId,
          user_id: userId
        }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response received:', responseText);

        if (responseText.includes('404') || responseText.includes('Not Found')) {
          setError('Chat API endpoint not found. Please check if the backend server is running.');
        } else if (responseText.includes('500') || responseText.includes('Internal Server Error')) {
          setError('Internal server error. Please contact support.');
        } else {
          setError('Invalid response format received from server.');
        }
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        // Handle different error statuses
        if (response.status === 401) {
          // Unauthorized - user needs to log in
          setError('Please log in to use the chatbot');
          throw new Error('Authentication required');
        } else if (response.status === 403) {
          // Forbidden - user doesn't have access
          setError('Access denied. Please check your permissions.');
          throw new Error('Access denied');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Failed to send message: ${response.statusText}`);
        }
      }

      const data = await response.json();

      // Update conversation ID if new conversation was created
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
        conversationManager.setActiveConversationId(data.conversation_id);
      }

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: data.message_id || crypto.randomUUID(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date(data.timestamp),
        conversationId: data.conversation_id,
        status: 'delivered'
      };

      // Add to messages
      setMessages(prev => [...prev, assistantMessage]);

      // Check if response indicates a task was added or created
      if (data.response && (data.response.toLowerCase().includes('added') || data.response.toLowerCase().includes('created'))) {
        // Dispatch task-updated event to notify dashboard
        window.dispatchEvent(new CustomEvent('task-updated'));
      }

      // Save messages to local storage
      if (data.conversation_id) {
        conversationManager.addMessageToConversation(data.conversation_id, userMessage);
        conversationManager.addMessageToConversation(data.conversation_id, assistantMessage);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');

      // Update user message status to error
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`chatbot-window ${isFullscreen ? 'fullscreen' : ''}`} role="dialog" aria-modal="true" aria-labelledby="chat-window-title">
      <div className="chatbot-header">
        <h3 id="chat-window-title">AI Assistant</h3>
        <button className="chatbot-close" onClick={handleClose} aria-label="Close chat">
          ×
        </button>
      </div>

      <div className="chatbot-messages" role="log" aria-live="polite">
        {messages.length === 0 && !isLoading && (
          <div className="message assistant" role="status" aria-live="polite">
            Hello! How can I help you manage your tasks today?
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender}`}
            aria-label={`${message.sender} said: ${message.content}`}
          >
            {message.content}
            {message.status === 'sending' && (
              <span className="loading-indicator" aria-label="Sending message"></span>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message assistant" role="status" aria-live="assertive">
            <span className="loading-indicator" aria-label="Loading response"></span>
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
        <input
          ref={inputRef}
          type="text"
          className="chatbot-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
          aria-label="Type your message"
          autoComplete="off"
        />
        <button
          className="chatbot-send-button"
          onClick={sendMessage}
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;