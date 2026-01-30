---
id: 002
title: Create MCP Tools Spec
stage: spec
date: 2026-01-22
surface: agent
model: Claude Sonnet 4.5
feature: mcp-tools-db-models
branch: 001-mcp-tools-db-models
user: Dell
command: sp.specify
labels: [mcp, database, models, specification, todo-chatbot]
links:
  spec: specs/001-mcp-tools-db-models/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-mcp-tools-db-models/spec.md
 - specs/001-mcp-tools-db-models/checklists/requirements.md
tests:
 - none
---

## Prompt


MCP Tools and Database Models for Phase III - Todo AI Chatbot
Target audience: Multi-user Todo app users interacting via natural language chatbot
Focus: Build foundation for AI agent – define new DB models and stateless MCP tools for task operations
Success criteria:
- New DB models added: Conversation and Message tables with proper relationships to users and tasks
- 5 MCP tools implemented exactly as specified: add_task, list_tasks, complete_task, delete_task, update_task
- Tools are stateless: All operations use SQLModel ORM, filter by user_id from parameters, no in-memory state
- Tools follow exact parameters, returns, and examples from spec
- User isolation enforced: Every tool checks/uses user_id to prevent data leaks
- Tools compatible with Cohere-powered agent (OpenAI Agents SDK structure follow karte hue)
- Errors handled gracefully (e.g., task not found returns proper message)
Constraints:
- Tech stack: Python FastAPI backend, SQLModel ORM, Neon PostgreSQL, Cohere SDK (for future agent calls), Official MCP SDK for tool exposure
- Monorepo structure: Changes only in /backend/ (models.py, routes/, mcp_tools.py or similar), /specs/features/mcp-tools.md
- Reference constitution: Use Cohere API (COHERE_API_KEY), follow OpenAI Agents SDK code patterns but replace LLM calls with Cohere, stateless design, Better Auth JWT
- No frontend changes, no chat endpoint yet, no agent logic yet – only DB + MCP tools
- Environment variables: DATABASE_URL, BETTER_AUTH_SECRET, COHERE_API_KEY
- Development workflow: Update /specs/features/mcp-tools.md first, then implement via Claude Code references
Not building:
- Chat endpoint (/api/chat)
- OpenAI Agents SDK agent/runner setup
- Frontend ChatKit UI
- Any natural language processing or conversation flow
- Authentication endpoint changes (already handled in Phase II)

Implementation details:
1. Update database schema (/specs/database/schema.md and backend/models.py):
   - Conversation: id (PK), user_id (FK to users.id), created_at, updated_at
   - Message: id (PK), conversation_id (FK), role ("user" or "assistant"), content (text), created_at
   - Indexes: user_id on Conversation, conversation_id on Message

2. Implement MCP tools using Official MCP SDK:
   - Tools file (e.g., backend/mcp/tools.py): Define 5 tools with exact spec
   - add_task: user_id (str), title (str), description (str optional) → return {"task_id": int, "status": "created", "title": str}
   - list_tasks: user_id (str), status (str optional: "all"/"pending"/"completed") → return array of task objects
   - complete_task: user_id (str), task_id (int) → return {"task_id": int, "status": "completed", "title": str}
   - delete_task: user_id (str), task_id (int) → return {"task_id": int, "status": "deleted", "title": str}
   - update_task: user_id (str), task_id (int), title (str optional), description (str optional) → return {"task_id": int, "status": "updated", "title": str}
   - All tools use SQLModel session, filter by user_id, raise proper exceptions for not found

3. Expose tools via MCP server setup (backend/mcp/server.py or integrated in FastAPI)

After implementation, reply with:
- Modified files list (e.g., backend/models.py, backend/mcp/tools.py)
- Key code snippets (Conversation/Message models, one example tool like add_task)
- Next step suggestion (e.g., test tools with MCP client)

## Response snapshot

Created a comprehensive feature specification for MCP Tools and Database Models for the Todo AI Chatbot. The specification includes:

1. Three user stories covering core functionality:
   - Natural Language Task Management (P1)
   - MCP Tool Integration for AI Agent (P2)
   - Secure Multi-User Data Isolation (P3)

2. Functional requirements including all 5 MCP tools (add_task, list_tasks, complete_task, delete_task, update_task), user isolation, error handling, and stateless operations

3. Key entities: Conversation, Message, and Task models

4. Success criteria with measurable outcomes for performance, security, and functionality

5. Edge cases for error conditions and concurrent access

The specification is stored in specs/001-mcp-tools-db-models/spec.md with a validation checklist in specs/001-mcp-tools-db-models/checklists/requirements.md. All requirements have been validated and the specification is ready for the planning phase.

## Outcome

- ✅ Impact: Created comprehensive feature specification for MCP tools and database models
- 🧪 Tests: No automated tests for specification creation
- 📁 Files: Created spec.md and requirements checklist in specs/001-mcp-tools-db-models/
- 🔁 Next prompts: Ready to proceed with /sp.plan to create implementation plan
- 🧠 Reflection: Specification covers all required functionality while maintaining focus on user value

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All validation checklist items completed
- Prompt variant (if applicable): Standard specification creation
- Next experiment (smallest change to try): Proceed with implementation planning