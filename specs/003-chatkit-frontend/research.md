# Research Findings: Frontend Chat Interface for Todo AI Chatbot

## Overview
This document captures research findings and resolves unknowns identified during the planning phase for the chatbot frontend feature.

## Resolved Unknowns

### 1. OpenAI ChatKit Integration
**Unknown**: How to properly integrate OpenAI ChatKit with the existing frontend
**Research**: OpenAI ChatKit is a React component library that provides pre-built chat UI components. For Next.js integration, we need to:
- Install @openai/chat-components package
- Configure with NEXT_PUBLIC_OPENAI_DOMAIN_KEY
- Handle authentication with existing Better Auth tokens
- Connect to backend API at /api/{user_id}/chat

**Decision**: Use OpenAI ChatKit as a hosted UI component with domain key configuration
**Rationale**: Matches the requirement to use OpenAI ChatKit for the chat interface with NEXT_PUBLIC_OPENAI_DOMAIN_KEY
**Alternatives considered**:
- Building custom chat UI from scratch (more time-consuming)
- Using alternative chat libraries (doesn't match spec requirement)

### 2. Authentication Integration
**Unknown**: How to pass Better Auth tokens to the ChatKit component
**Research**: The ChatKit component needs to make API calls to our backend. We need to intercept these calls to add the Authorization Bearer header with the existing Better Auth token.

**Decision**: Wrap the ChatKit component with authentication logic that adds the JWT token to API requests
**Rationale**: Maintains security requirements from constitution (user isolation) while satisfying FR-004
**Alternatives considered**:
- Passing token as prop (less secure)
- Storing token in localStorage (security concerns)

### 3. Responsive Design Implementation
**Unknown**: How to implement different behaviors for mobile vs desktop
**Research**: Use Next.js responsive utilities or CSS media queries to detect screen size and adjust the ChatKit component behavior accordingly.

**Decision**: Implement conditional rendering based on screen size - full-screen on mobile, modal/popup on desktop
**Rationale**: Directly satisfies FR-002 requirement for different mobile/desktop experiences
**Alternatives considered**:
- Separate components for mobile/desktop (unnecessary complexity)
- Single responsive component (would be complex to manage)

### 4. Conversation State Management
**Unknown**: How to pass conversation_id to maintain context
**Research**: Need to initialize the ChatKit component with the conversation_id from previous sessions, likely stored in browser storage or retrieved from backend.

**Decision**: Store conversation_id in browser's localStorage and pass to ChatKit component initialization
**Rationale**: Satisfies FR-005 requirement to maintain conversation context across sessions
**Alternatives considered**:
- Session storage (lost on tab close)
- Backend retrieval (more complex API calls)

### 5. UI Trigger Design
**Unknown**: Best approach for chat interface trigger (floating button vs fixed sidebar)
**Research**: For modern applications, floating action buttons (FABs) provide easy access without disrupting the main UI flow.

**Decision**: Floating button positioned at bottom-right corner of screen
**Rationale**: Provides modern app feel with minimal UI disruption, accessible from any page, matches common chat application patterns
**Alternatives considered**:
- Fixed sidebar button (takes up permanent screen space)
- Menu item (less discoverable and accessible)

### 6. Folder Structure Organization
**Unknown**: Specific file organization within /frontend/chatbot/
**Research**: Following React best practices and component organization patterns.

**Decision**: Create /frontend/chatbot/ with ChatbotButton.tsx, ChatWindow.tsx, and chatbot.css
**Rationale**: Matches implementation details in spec (requirement #1) and promotes modularity
**Alternatives considered**:
- Different component naming (less descriptive)
- Different folder structure (doesn't match spec)

## Technology Stack Confirmation
- **Frontend Framework**: Next.js (existing project uses this)
- **UI Library**: OpenAI ChatKit (as required by spec)
- **Styling**: CSS with glassmorphism effects (as required by spec)
- **Authentication**: Better Auth (existing system, per constitution)
- **Environment Configuration**: NEXT_PUBLIC_OPENAI_DOMAIN_KEY (as required by spec)

## Architecture Decisions
1. **Component Separation**: Split into ChatbotButton (floating button) and ChatWindow (main interface)
2. **State Management**: Use React state for UI state, localStorage for conversation persistence
3. **API Integration**: Intercept ChatKit API calls to add authentication headers
4. **Responsive Design**: CSS media queries to detect device type and adjust UI accordingly
5. **UI Trigger**: Floating button at fixed bottom-right position for universal access
6. **Window Behavior**: Modal on desktop, full-screen on mobile for optimal UX