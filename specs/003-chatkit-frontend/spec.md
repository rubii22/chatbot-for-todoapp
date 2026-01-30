# Feature Specification: Frontend Chat Interface for Todo AI Chatbot

**Feature Branch**: `003-chatkit-frontend`
**Created**: 2026-01-28
**Status**: Draft
**Input**: User description: "Frontend Chat Interface for Phase III - Todo AI Chatbot Target audience: Users wanting quick natural language task management via chat Focus: Integrate floating chatbot UI in existing frontend folder using OpenAI ChatKit, triggered from home/dashboard page Success criteria: - Chatbot UI added inside existing /frontend folder (no new separate frontend project) - Create sub-folder /frontend/chatbot/ for all chatbot-related UI, CSS, components - Add floating chat icon/button on right-bottom of main pages (e.g., src/app/page.tsx or dashboard page) – click karne pe chat interface open ho (modal/popup/full-screen chat) - Chat interface uses OpenAI ChatKit (hosted UI) with backend calls to /api/{user_id}/chat - Messages history, input box, send button, loading state – professional glassmorphism style (match existing app theme) - Auth: Use existing Better Auth token (Authorization Bearer) for API calls - Conversation resume: Pass conversation_id from previous chats Constraints: - ONLY work inside existing /frontend folder (no new repo/project) - Create /frontend/chatbot/ folder for organization (ChatbotButton.tsx, ChatWindow.tsx, styles.css, etc.) - Floating button/icon: Right-bottom fixed position, glassmorphism style, click toggle chat window - Use NEXT_PUBLIC_API_URL for backend calls - Environment: NEXT_PUBLIC_OPENAI_DOMAIN_KEY (add to .env.local if needed) - Development: Update /specs/features/chatbot-frontend.md first, implement via Claude Code - Do NOT change existing UI (navbar, dashboard, tasks list), backend, auth logic, MCP tools, or add new dependencies unless required for ChatKit - No separate frontend deployment – integrate in current Next.js app Implementation details: 1. Create /frontend/chatbot/ folder with: - ChatbotButton.tsx (floating right-bottom icon/button) - ChatWindow.tsx (chat interface modal/popup using ChatKit) - chatbot.css (glassmorphism styles, dark theme) 2. In src/app/page.tsx (or dashboard layout/page): Add floating ChatbotButton component 3. ChatKit setup: Use hosted ChatKit with domain key, connect to backend /api/chat endpoint 4. API calls: POST to /api/{user_id}/chat with message, conversation_id, Authorization header 5. Responsive: Mobile pe full-screen chat, desktop pe popup/modal 6. Style match: Glassmorphism, dark bg, floating orbs if existing, text visibility After implementation, reply with: - Created/updated files list (e.g., /frontend/chatbot/ChatbotButton.tsx, src/app/page.tsx) - Key code snippet (ChatbotButton integration in page.tsx, ChatKit config) - Run command: cd frontend && npm run dev"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Chat Interface from Any Page (Priority: P1)

Users can quickly access the AI chatbot from any page in the application by clicking a floating button positioned at the bottom-right corner. The chat interface opens in a modal or popup on desktop, and full-screen on mobile devices, allowing users to manage their tasks using natural language.

**Why this priority**: This is the core functionality that enables users to interact with the AI assistant without navigating away from their current page, providing immediate task management capabilities.

**Independent Test**: Can be fully tested by clicking the floating chat button and verifying that the chat interface opens properly with the correct styling and positioning.

**Acceptance Scenarios**:

1. **Given** user is on any page in the application, **When** user clicks the floating chat button, **Then** the chat interface modal/popup opens with glassmorphism styling
2. **Given** user is on a mobile device, **When** user clicks the floating chat button, **Then** the chat interface opens in full-screen mode
3. **Given** user has an active session with valid auth token, **When** user opens chat interface, **Then** the chat interface is ready to send messages with proper authentication

---

### User Story 2 - Interact with AI Assistant for Task Management (Priority: P1)

Users can type natural language commands in the chat interface to create, update, or manage their tasks. The AI assistant processes these commands and responds appropriately, maintaining conversation context through conversation_id.

**Why this priority**: This is the core value proposition - enabling users to manage their tasks through natural language conversations with the AI assistant.

**Independent Test**: Can be fully tested by sending messages to the AI assistant and verifying that responses are received and displayed properly.

**Acceptance Scenarios**:

1. **Given** chat interface is open, **When** user types a message and clicks send, **Then** the message appears in the chat history and is sent to the backend API
2. **Given** user has previous conversations, **When** chat interface opens, **Then** conversation_id is passed to maintain context
3. **Given** user sends a task-related command, **When** AI processes the request, **Then** appropriate response is displayed showing task creation/update status

---

### User Story 3 - Maintain Conversation State and Authentication (Priority: P2)

The chat interface maintains proper authentication using existing Better Auth tokens and preserves conversation state across page navigations and sessions, allowing users to resume conversations seamlessly.

**Why this priority**: Ensures secure communication and a smooth user experience by maintaining authentication and conversation continuity.

**Independent Test**: Can be tested by verifying that auth tokens are properly passed with API requests and conversation history persists appropriately.

**Acceptance Scenarios**:

1. **Given** user is logged in with valid auth token, **When** chat messages are sent, **Then** Authorization Bearer header contains the valid token
2. **Given** user has previous conversation history, **When** chat interface opens, **Then** conversation_id from previous session is used to resume conversation
3. **Given** user refreshes the page, **When** chat interface opens, **Then** previous conversation context is maintained

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a floating chat button on all main pages at the bottom-right position with glassmorphism styling
- **FR-002**: System MUST open the chat interface as a modal/popup on desktop and full-screen on mobile when the floating button is clicked
- **FR-003**: Users MUST be able to type messages in the input box and send them to the backend API at /api/{user_id}/chat
- **FR-004**: System MUST include the existing Better Auth token in the Authorization Bearer header for all API requests
- **FR-005**: System MUST pass conversation_id to maintain conversation context across sessions
- **FR-006**: System MUST display message history in the chat interface with proper formatting and loading states
- **FR-007**: System MUST use OpenAI ChatKit for the chat interface with NEXT_PUBLIC_OPENAI_DOMAIN_KEY for configuration
- **FR-008**: System MUST organize all chatbot-related components in the /frontend/chatbot/ folder
- **FR-009**: System MUST implement glassmorphism styling with dark theme to match existing app design

### Key Entities *(include if feature involves data)*

- **Chat Message**: Represents a message exchanged between user and AI assistant, containing text content, timestamp, sender type (user/assistant), and associated conversation_id
- **Conversation Session**: Represents a persistent conversation thread identified by conversation_id, allowing users to resume previous interactions

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can access the chat interface from any page within 1 click and have it open within 1 second
- **SC-002**: 95% of chat messages are successfully sent to the backend API with proper authentication headers
- **SC-003**: Users can maintain conversation context by resuming previous conversations using conversation_id
- **SC-004**: Chat interface displays properly on both desktop and mobile devices with responsive design
- **SC-005**: All UI elements use consistent glassmorphism styling that matches the existing app theme
