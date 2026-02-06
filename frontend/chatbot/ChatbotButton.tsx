import React from 'react';
import './chatbot.css';

interface ChatbotButtonProps {
  onClick: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick }) => {
  return (
    <div className="chatbot-container">
      <button
        className="chatbot-button"
        onClick={onClick}
        aria-label="Open AI Assistant"
        title="Chat with AI Assistant"
      >
        {/* Professional AI Chat Icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="chatbot-icon"
        >
          {/* Chat bubble with sparkle/AI indicator */}
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.6 15.72 3.62 17.19L2.05 21.95L6.81 20.38C8.28 21.4 10.07 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255, 255, 255, 0.1)"
          />
          {/* AI Sparkle/Star */}
          <path
            d="M12 7L12.9 9.9L15 11L12.9 12.1L12 15L11.1 12.1L9 11L11.1 9.9L12 7Z"
            fill="currentColor"
          />
          <circle cx="8" cy="11" r="0.8" fill="currentColor" />
          <circle cx="16" cy="11" r="0.8" fill="currentColor" />
        </svg>

        {/* Notification badge (optional - can be used for unread messages) */}
        <span className="chatbot-badge" style={{ display: 'none' }}>
          <span className="chatbot-badge-pulse"></span>
        </span>
      </button>
    </div>
  );
};

export default ChatbotButton;