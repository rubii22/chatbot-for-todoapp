---
id: 4
title: update-implementation-plan
stage: plan
date: 2026-01-28
surface: agent
model: Claude Sonnet 4.5
feature: chatkit-frontend
branch: 003-chatkit-frontend
user: rubii22
command: /sp.plan
labels: ["plan", "frontend", "chatbot", "architecture", "ui"]
links:
  spec: ../specs/003-chatkit-frontend/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-chatkit-frontend/plan.md
  - specs/003-chatkit-frontend/research.md
  - specs/003-chatkit-frontend/quickstart.md
tests:
  - none
---

## Prompt

003-chatkit-frontend
Create: Chatbot frontend architecture sketch (floating button + chat window), component structure in /frontend/chatbot/, integration points in src/app/page.tsx (or dashboard), CSS styling for glassmorphism, implementation steps with Claude Code.
Decisions needing documentation:

Chat trigger: Floating right-bottom icon vs fixed sidebar button – floating icon for modern app feel.
Chat window: Modal/popup vs full-screen – modal for quick use.
ChatKit integration: Hosted ChatKit vs custom UI – hosted for simplicity + OpenAI domain key support.

Testing strategy: Visual: Floating button visible on home/dashboard, click opens chat window.
Functional: Send message → backend /api/chat call → response shown.
Responsive: Mobile full-screen chat, desktop modal.
Auth: Token passed in headers for protected endpoint.

Technical details:

Spec-driven: "@specs/features/chatbot-frontend.md implement floating chat button and ChatKit window"
Existing frontend folder: Add /frontend/chatbot/ for ChatbotButton.tsx, ChatWindow.tsx, chatbot.css
Integration: Add <ChatbotButton /> in src/app/page.tsx (or layout) – fixed right-bottom
Style: Glassmorphism (backdrop-blur, bg-black/20, border-white/10), match app theme
Phases:
Create /frontend/chatbot/ folder + components (button, window)
Add floating button to main page(s)
Integrate OpenAI ChatKit (domain key from env)
Connect chat to /api/{user_id}/chat with auth token
Test toggle, message sending, response display

Env: NEXT_PUBLIC_OPENAI_DOMAIN_KEY, NEXT_PUBLIC_API_URL                                                                                                  No backend changes, no new dependencies beyond ChatKit if required

No new frontend project – only add to existing /frontend folder.

## Response snapshot

Updated implementation plan with architecture sketch, component structure, integration points, and detailed technical decisions for the chatbot frontend.

## Outcome

- ✅ Impact: Enhanced plan with detailed architecture sketch and implementation phases
- 🧪 Tests: none
- 📁 Files: specs/003-chatkit-frontend/plan.md, research.md, quickstart.md updated
- 🔁 Next prompts: Ready for implementation
- 🧠 Reflection: Plan now includes specific UI decisions and responsive behavior details

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A