# Implementation Plan: Frontend Chat Interface for Todo AI Chatbot

**Branch**: `003-chatkit-frontend` | **Date**: 2026-01-28 | **Spec**: [link to spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-chatkit-frontend/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a floating chatbot UI using OpenAI ChatKit integrated into the existing frontend, allowing users to manage tasks via natural language. The solution includes a floating button for access, responsive chat interface (modal on desktop/full-screen on mobile), authentication with Better Auth tokens, and conversation state management. The architecture follows a component-based approach with a floating button trigger and a chat window component.

## Technical Context

**Language/Version**: TypeScript/JavaScript (Next.js project)
**Primary Dependencies**: OpenAI ChatKit, React, Next.js, Better Auth
**Storage**: Browser localStorage for conversation state, Neon PostgreSQL for backend
**Testing**: Jest/React Testing Library for frontend components
**Target Platform**: Web browsers (desktop and mobile)
**Project Type**: Web application (extension to existing frontend)
**Performance Goals**: <1 second chat interface load time, real-time messaging
**Constraints**: Must integrate with existing Better Auth system, follow glassmorphism design, maintain user isolation
**Scale/Scope**: Individual user sessions with authenticated access only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven Development**: ✅ Following spec from `/specs/003-chatkit-frontend/spec.md`
- **Stateless Server Architecture**: ✅ Chat interface connects to backend API as specified
- **Cohere-Powered Intelligence**: ⚠️ Using OpenAI ChatKit UI with Cohere-powered backend (specifies backend calls to /api/{user_id}/chat)
- **Strict User Isolation**: ✅ Using Better Auth JWT tokens for user authentication
- **OpenAI Agents SDK Patterns with Cohere**: ⚠️ Using OpenAI ChatKit UI with Cohere backend integration
- **Persistent Conversation History**: ✅ Maintaining conversation_id for context preservation

**Constitution Compliance**: The frontend uses OpenAI ChatKit UI as specified, while connecting to a Cohere-powered backend as required by constitution. This hybrid approach maintains compliance with both the spec requirement for OpenAI ChatKit UI and the constitution requirement for Cohere-powered intelligence.

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

### Architecture Flow
1. **Trigger**: Floating button at right-bottom position (fixed)
2. **Display**: Modal on desktop, fullscreen on mobile (responsive)
3. **Integration**: OpenAI ChatKit with domain key configuration
4. **Communication**: API calls to /api/{user_id}/chat with auth token
5. **State**: Conversation persistence via localStorage

### Component Details

#### ChatbotButton.tsx
- Fixed position: bottom-4, right-4
- Floating icon with glassmorphism effect
- Click toggles ChatWindow visibility
- Shows notification indicator when needed

#### ChatWindow.tsx
- Modal overlay with backdrop
- OpenAI ChatKit component integration
- Responsive sizing (modal vs fullscreen)
- Authentication header injection
- Conversation state management

## Project Structure

### Documentation (this feature)

```text
specs/003-chatkit-frontend/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── chatbot/                 # New chatbot components folder
│   ├── ChatbotButton.tsx    # Floating chat button component
│   ├── ChatWindow.tsx       # Main chat interface component
│   └── chatbot.css          # Glassmorphism styling
└── src/
    └── app/
        └── page.tsx         # Home page with ChatbotButton integration

backend/
└── src/
    └── api/
        └── {user_id}/
            └── chat/        # Backend API endpoint for chat
```

**Structure Decision**: Extending the existing web application structure with new chatbot components in a dedicated folder. The frontend extension integrates with the existing Next.js app structure while maintaining separation of concerns.

## Decision Log

### Chat Trigger Design
**Decision**: Floating right-bottom icon vs fixed sidebar button
**Rationale**: Floating icon provides modern app feel with minimal UI disruption, accessible from any page
**Alternative Considered**: Sidebar button would take up permanent screen space

### Chat Window Behavior
**Decision**: Modal/popup vs full-screen
**Rationale**: Modal for desktop provides quick access without full page takeover; full-screen for mobile provides better UX on smaller screens
**Alternative Considered**: Full-screen on all devices would be disruptive on desktop

### ChatKit Integration
**Decision**: Hosted ChatKit vs custom UI
**Rationale**: Hosted ChatKit provides rich functionality with minimal development time, supports OpenAI domain key
**Alternative Considered**: Custom UI would require significant development effort

## Testing Strategy

### Visual Testing
- Floating button visible on home/dashboard pages
- Click opens chat window with proper animation
- Responsive behavior on different screen sizes

### Functional Testing
- Send message triggers backend /api/chat call
- Response from backend displays in chat window
- Authentication token properly passed in headers

### Responsive Testing
- Mobile devices show full-screen chat
- Desktop shows modal/popup chat
- Smooth transition between screen sizes

### Authentication Testing
- Token retrieved from Better Auth session
- Passed in Authorization header for all API calls
- Protected endpoint access validated

## Implementation Phases

### Phase 1: Component Creation
- Create /frontend/chatbot/ folder structure
- Implement ChatbotButton.tsx with floating position
- Implement ChatWindow.tsx with basic UI
- Add glassmorphism CSS styling

### Phase 2: Integration
- Add ChatbotButton to src/app/page.tsx
- Connect OpenAI ChatKit with domain key
- Implement API connection to /api/{user_id}/chat

### Phase 3: Authentication & State
- Integrate Better Auth token retrieval
- Implement conversation state persistence
- Add responsive behavior (mobile vs desktop)

## Environment Variables

- `NEXT_PUBLIC_OPENAI_DOMAIN_KEY`: For OpenAI ChatKit configuration
- `NEXT_PUBLIC_API_URL`: For backend API endpoint

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| OpenAI ChatKit UI with Cohere backend | Spec requires OpenAI ChatKit UI, constitution requires Cohere-powered intelligence | Would need to build custom UI from scratch to fully comply with both requirements |
