# Quickstart Guide: Frontend Chat Interface for Todo AI Chatbot

## Overview
This guide provides a quick overview of the chatbot frontend implementation, including setup, key components, and integration points. The architecture features a floating chat button and responsive chat window using OpenAI ChatKit.

## Prerequisites
- Node.js 18+ installed
- Next.js project with Better Auth already configured
- Access to backend API at `/api/{user_id}/chat`
- NEXT_PUBLIC_OPENAI_DOMAIN_KEY configured in environment

## Architecture Sketch

### Component Structure
```
/frontend/
├── chatbot/                 # Chatbot components directory
│   ├── ChatbotButton.tsx    # Floating chat button component (right-bottom)
│   ├── ChatWindow.tsx       # Main chat interface component (modal/fullscreen)
│   └── chatbot.css          # Glassmorphism styling
└── public/
    └── icons/
        └── chat-icon.svg    # Chat icon for floating button
```

### Integration Points
```
/src/app/
└── page.tsx                 # Home page with <ChatbotButton /> integration
```

## Key Components

### 1. ChatbotButton.tsx
The floating button that appears at the bottom-right of all main pages:
- Fixed position at bottom-4, right-4 with glassmorphism styling
- Toggles the chat interface when clicked
- Shows notification indicator for unread messages
- Responsive behavior with proper z-index stacking

### 2. ChatWindow.tsx
The main chat interface component:
- Modal overlay on desktop, full-screen on mobile
- Integrates with OpenAI ChatKit for UI
- Handles authentication with Better Auth tokens
- Manages conversation state and history via localStorage
- Responsive sizing based on screen dimensions

### 3. chatbot.css
CSS file containing glassmorphism styling:
- Backdrop-filter for frosted glass effect
- Semi-transparent backgrounds with border highlights
- Dark theme with subtle color accents
- Consistent design with existing app
- Responsive adjustments for different screen sizes

## Integration Points

### Page Integration
Add the ChatbotButton to main pages (e.g., `src/app/page.tsx`):
```jsx
import ChatbotButton from '../chatbot/ChatbotButton';

export default function HomePage() {
  return (
    <div>
      {/* Existing page content */}
      <ChatbotButton />
    </div>
  );
}
```

### Environment Variables
Add to `.env.local`:
```env
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your_domain_key_here
NEXT_PUBLIC_API_URL=your_api_url_here
```

## API Integration
The chat interface communicates with the backend API:
- Endpoint: `POST /api/{user_id}/chat`
- Authentication: Bearer token in Authorization header
- Payload: message content and conversation_id
- Response: AI response and updated conversation_id

## Styling Guidelines
- Glassmorphism: backdrop-filter: blur(10px), background: rgba(0,0,0,0.2)
- Borders: 1px solid rgba(255,255,255,0.1)
- Colors: Dark theme with accent colors that match existing app
- Transitions: Smooth animations for open/close states

## Development Workflow
1. Create components in `/frontend/chatbot/` folder
2. Add ChatbotButton to main pages
3. Configure environment variables
4. Test authentication flow
5. Verify responsive behavior (modal vs fullscreen)
6. Confirm conversation state persistence
7. Validate glassmorphism styling matches app theme

## Testing Points
- Floating button appears correctly on all main pages
- Chat interface opens with proper styling
- Authentication tokens are passed correctly
- Messages are sent/received properly
- Conversation state persists across sessions
- Responsive design: modal on desktop, fullscreen on mobile
- Error handling for network issues
- Glassmorphism styling matches existing app theme