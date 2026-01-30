---
id: 001
title: Update Project Constitution
stage: constitution
date: 2026-01-22
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: Dell
command: sp.constitution
labels: [constitution, todo-chatbot, spec-driven-development]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt


Project: Phase III - Todo AI Chatbot
Core principles:
- Spec-driven development using Claude Code and Spec-Kit Plus for modular, traceable implementation
- Stateless server architecture with all state persisted in Neon PostgreSQL database
- Natural language understanding via Cohere LLM (not OpenAI) for cost-efficiency and performance
- Strict user isolation: All operations filtered by authenticated user's ID (Better Auth JWT)
-Follow OpenAI Agents SDK code structure and patterns (agent, runner, tools), but replace OpenAI API calls with Cohere SDK calls
- Conversation history maintained in DB for stateless requests and resume capability
- Security: All endpoints protected with JWT, no direct DB access from frontend
- Responsiveness: Chat interface fast and reliable, error handling graceful
Key standards:- All features reference specs in /specs/ (e.g., @specs/features/mcp-tools.md, @specs/features/chatbot-agent.md)
- MCP tools expose task operations (add, list, complete, delete, update) with exact parameters/returns as defined
- Chat endpoint: POST /api/{user_id}/chat – stateless, uses Cohere for agent reasoning
- Database models: Extend existing tasks with Conversation and Message tables
- Authentication: Better Auth JWT tokens verified in FastAPI middleware
- Code patterns:Follow backend CLAUDE.md (FastAPI, SQLModel, routes/, db.py)
- Testing: Validate user isolation, tool calls, conversation persistence, error responses
Constraints:- Tech stack: Frontend - OpenAI ChatKit (UI only), Backend - Python FastAPI, AI - Cohere SDK (instead of OpenAI), MCP - Official MCP SDK, ORM - SQLModel, DB - Neon PostgreSQL, Auth - Better Auth
- Use Cohere API key (via env var COHERE_API_KEY) for all LLM/agent calls
- Monorepo structure: /frontend (ChatKit), /backend (FastAPI + Agents-like structure + MCP), /specs
- No OpenAI API calls – only Cohere models (e.g., command-r-plus or similar)
- Phases: Focus on Phase III basic level; no advanced features like voice/multimodal
- Environment variables: COHERE_API_KEY, DATABASE_URL, BETTER_AUTH_SECRET, NEXT_PUBLIC_API_URL
- Development workflow:Update specs first, implement via Claude Code references
Success criteria:
- Chatbot handles all 5 basic task operations via natural language
- MCP tools correctly invoked by Cohere-powered agent
- Conversation persists across requests/sessions via DB
- Stateless server: No in-memory state, handles restarts gracefully
- User isolation enforced: Only own tasks visible/editable
- Frontend ChatKit UI connects to /api/chat endpoint with auth
- Domain allowlist configured for hosted ChatKit (OpenAI security)
- Project deployable: Vercel for frontend, HF Spaces or similar for backend

## Response snapshot

Updated the project constitution file (.specify/memory/constitution.md) to reflect the Todo AI Chatbot project requirements with specific principles around spec-driven development, stateless architecture, Cohere-powered intelligence, user isolation, and persistent conversation history. Added sections for tech stack standards, development workflow, and security compliance. Version updated from 1.0.0 to 2.0.0 with today's date as ratification and amendment date.

## Outcome

- ✅ Impact: Major update to project constitution reflecting Todo AI Chatbot specific requirements
- 🧪 Tests: No tests required for constitution update
- 📁 Files: Updated .specify/memory/constitution.md with new project-specific principles
- 🔁 Next prompts: Proceed with feature specification based on updated constitution
- 🧠 Reflection: Constitution now properly aligned with project requirements and can guide future development

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - Constitution properly updated with all required principles
- Prompt variant (if applicable): Standard constitution update
- Next experiment (smallest change to try): Begin feature specification based on updated constitution