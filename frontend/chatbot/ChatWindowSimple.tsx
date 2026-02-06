import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
    if (!inputValue.trim() || isLoading) return; // Prevent sending while loading

    const messageContent = inputValue.trim();
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      conversationId: conversationId || '',
      status: 'sending'
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      // Get auth token
      const token = await authWrapper.getToken();

      // Check if we're dealing with a guest user and no token exists
      if (userId === 'guest' && !token) {
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
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: messageContent,
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
        if (response.status === 401) {
          setError('Please log in to use the chatbot');
          throw new Error('Authentication required');
        } else if (response.status === 403) {
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

      // Update user message status to sent and add assistant message
      setMessages(prev => {
        const updated = prev.map(msg =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
        );
        return [...updated, assistantMessage];
      });

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
        <div className="flex items-center gap-2">
          <div className="bg-green-400 rounded-full w-2 h-2 animate-pulse"></div>
          <h3 id="chat-window-title" className="font-semibold">AI Assistant</h3>
        </div>
        <button className="chatbot-close" onClick={handleClose} aria-label="Close chat">
          ×
        </button>
      </div>

      <div className="chatbot-messages" role="log" aria-live="polite">
        {messages.length === 0 && !isLoading && (
          <div className="message assistant" role="status" aria-live="polite">
            <div className="message-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                👋 **Hello!** How can I help you manage your tasks today?
              </ReactMarkdown>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender}`}
            aria-label={`${message.sender} said: ${message.content}`}
          >
            <div className="message-content">
              {message.sender === 'assistant' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom styling for markdown elements
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="space-y-1 mb-2 list-disc list-inside">{children}</ul>,
                    ol: ({ children }) => <ol className="space-y-1 mb-2 list-decimal list-inside">{children}</ol>,
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-sm">{children}</code>,
                    pre: ({ children }) => <pre className="bg-white/10 mb-2 p-3 rounded-lg overflow-x-auto">{children}</pre>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <span>{message.content}</span>
              )}
            </div>
            {message.status === 'sending' && (
              <span className="mt-1 text-gray-400 text-xs message-status">Sending...</span>
            )}
            {message.status === 'error' && (
              <span className="mt-1 text-red-400 text-xs message-status">Failed to send</span>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message assistant" role="status" aria-live="assertive">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="bg-gray-400 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="bg-gray-400 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="bg-gray-400 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-gray-400 text-sm">AI is thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-500/20 mx-4 my-2 px-4 py-3 border border-red-500/30 rounded-lg text-red-200"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start gap-2">
              <svg className="flex-shrink-0 mt-0.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
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
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;