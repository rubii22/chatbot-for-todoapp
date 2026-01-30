---
id: 007
title: Create AI Agent Chat Spec
stage: spec
date: 2026-01-22
surface: agent
model: Claude Sonnet 4.5
feature: ai-agent-chat
branch: 001-ai-agent-chat
user: Dell
command: sp.specify
labels: [ai-agent, chat, cohere, mcp, todo-chatbot]
links:
  spec: specs/001-ai-agent-chat/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-ai-agent-chat/spec.md
 - specs/001-ai-agent-chat/checklists/requirements.md
tests:
 - none
---

## Prompt


AI Agent and Chat Endpoint for Phase III - Todo AI Chatbot
Target audience: Users managing tasks via natural language chat
Focus: Build stateless chat endpoint and Cohere-powered AI agent that uses MCP tools for task operations
Success criteria:
- POST /api/{user_id}/chat endpoint implemented: receives message, persists conversation, runs agent, returns response + tool_calls
- Agent uses Cohere LLM (COHERE_API_KEY) for reasoning and tool calls (OpenAI Agents SDK structure follow, but Cohere calls)
- Conversation history fetched from DB, user message stored, agent response stored
- Agent maps natural language to MCP tools (add_task on "add", list_tasks on "show", etc.) with confirmation/error messages
- Stateless: No server memory, all state in DB (Conversation + Messages)
- User isolation: Agent uses user_id from token/path, tools filter by user_id
- Error handling: Invalid input, task not found, auth fail – friendly responses
Constraints:
- Tech stack: FastAPI backend, Cohere SDK (COHERE_API_KEY), SQLModel, Neon PostgreSQL, Better Auth JWT
- Use existing MCP tools (from spec 1) – real or mock
- Monorepo: Changes only in /backend/ (routes/chat.py or main.py, agent.py, db interactions)
- Reference constitution: Cohere for LLM, stateless, user isolation, OpenAI Agents SDK patterns (agent + runner)
- Environment: COHERE_API_KEY, DATABASE_URL, BETTER_AUTH_SECRET                                                                          - Development: Update /specs/features/chatbot-agent.md first, implement via Claude Code (@specs/...)
Not building:
- Frontend ChatKit UI (spec 3)
- MCP tools (already in spec 1)
- Domain allowlist or ChatKit setup

Implementation details:
1. Chat endpoint: POST /api/{user_id}/chat
   - Request: {"conversation_id": int (optional), "message": str}
   - Auth: JWT token → extract user_id (match with path)
   - Flow: Fetch history, store user message, run Cohere agent, store response, return {"conversation_id": int, "response": str, "tool_calls": array}

2. AI Agent: Cohere-powered (use Cohere SDK for chat/completions)
   - Follow OpenAI Agents SDK structure: agent with tools list, runner to execute
   - Tools: Existing MCP tools (call_tool function se call)                                                                              - Behavior: Map commands (add→add_task, show→list_tasks, etc.), confirm actions, handle errors
   - Use COHERE_API_KEY for LLM calls

3. DB interactions: SQLModel session for Conversation/Message save/fetch

After implementation, reply with:
- Changed files (e.g., backend/routes/chat.py, backend/agent.py)
- Key code snippet (chat endpoint, agent runner with Cohere call)
- Test command: uv run curl -X POST http://localhost:8000/api/{user_id}/chat -d '{"message": "Add task buy milk"}'

## Response snapshot

Created a comprehensive feature specification for the AI Agent and Chat Endpoint feature. The specification includes:

1. Three user stories covering the core functionality:
   - Natural Language Task Management (P1)
   - Stateful Conversation Experience (P2)
   - Cohere-Powered Intelligence (P3)

2. Functional requirements for the chat endpoint, Cohere integration, natural language processing, conversation persistence, and user isolation

3. Key entities: Conversation, Message, and Task models

4. Success criteria with measurable outcomes for accuracy, security, user satisfaction, and reliability

5. Edge cases for error conditions and API availability

The specification is stored in specs/001-ai-agent-chat/spec.md with a validation checklist in specs/001-ai-agent-chat/checklists/requirements.md. All requirements have been validated and the specification is ready for the planning phase.

## Outcome

- ✅ Impact: Created comprehensive feature specification for AI agent and chat endpoint
- 🧪 Tests: No automated tests for specification creation
- 📁 Files: Created spec.md and requirements checklist in specs/001-ai-agent-chat/
- 🔁 Next prompts: Ready to proceed with /sp.plan to create implementation plan
- 🧠 Reflection: Specification covers all required functionality while maintaining focus on user value

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All validation checklist items completed
- Prompt variant (if applicable): Standard specification creation
- Next experiment (smallest change to try): Proceed with implementation planning