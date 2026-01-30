import React, { useState, useEffect } from 'react';
import './chatbot.css';

interface ChatbotButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick, hasUnread = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Handle scroll to hide/show button as needed
  useEffect(() => {
    const handleScroll = () => {
      // You can customize this logic based on your needs
      // For now, keeping the button always visible
      setIsVisible(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="chatbot-container" role="presentation">
      <button
        className={`chatbot-button ${hasUnread ? 'unread' : ''}`}
        onClick={onClick}
        aria-label={hasUnread ? "Open chat, unread messages" : "Open chat"}
        title={hasUnread ? "Open chat, unread messages" : "Open chat"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" role="img" aria-label="Chat icon">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 13.58 2.36 15.07 3.02 16.4L2 22L7.6 20.97C8.93 21.64 10.42 22 12 22C17.52 22 22 17.52 22 12S17.52 2 12 2ZM12 20C8.69 20 6 17.31 6 14S8.69 8 12 8 18 10.69 18 14 15.31 20 12 20ZM13 9H11V13H7V15H11V19H13V15H17V13H13V9Z" />
        </svg>
        {hasUnread && (
          <span
            className="unread-indicator"
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '12px',
              height: '12px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid white'
            }}
            aria-label="unread message indicator"
            role="status"
          ></span>
        )}
      </button>
    </div>
  );
};

export default ChatbotButton;