# Implementation Plan: AI Agent and Chat Endpoint

**Branch**: `001-ai-agent-chat` | **Date**: 2026-01-22 | **Spec**: [specs/001-ai-agent-chat/spec.md](../spec.md)
**Input**: Feature specification from `/specs/001-ai-agent-chat/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a stateless chat endpoint and Cohere-powered AI agent that uses MCP tools for task operations. This includes creating a POST /api/{user_id}/chat endpoint that receives user messages, fetches conversation history from the database, runs the Cohere agent to map natural language to appropriate MCP tools, and returns responses with tool call information. The implementation will follow OpenAI Agents SDK patterns but use Cohere SDK for LLM calls, maintaining stateless architecture with all conversation data persisted in the database.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, Cohere SDK, SQLModel, mcp, Better Auth
**Storage**: PostgreSQL (Neon)
**Testing**: pytest
**Target Platform**: Linux server
**Project Type**: backend/single - determines source structure
**Performance Goals**: Chat endpoint responds to requests in under 3 seconds for 95% of operations
**Constraints**: All operations must filter by user_id for data isolation, no in-memory state storage, tools must be stateless
**Scale/Scope**: Support multi-user environment with proper data isolation and concurrent access

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-driven development: Following specification in /specs/001-ai-agent-chat/spec.md
- ✅ Stateless server architecture: No in-memory state between requests, all data in DB
- ✅ Cohere-powered intelligence: Will integrate Cohere SDK for AI operations
- ✅ Strict user isolation: All operations will be filtered by user_id
- ✅ OpenAI Agents SDK patterns with Cohere: Following patterns but replacing OpenAI with Cohere
- ✅ Persistent conversation history: Using existing Conversation and Message models

## Project Structure

### Documentation (this feature)
```text
specs/001-ai-agent-chat/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
```text
backend/
├── src/
│   ├── routes/
│   │   └── chat.py      # Chat endpoint implementation
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── agent.py     # Cohere-powered AI agent implementation
│   │   └── runner.py    # Tool runner for MCP integration
│   ├── models/          # Existing models
│   ├── mcp/             # Existing MCP tools
│   └── db.py            # Existing database connections
└── tests/
    ├── routes/
    │   └── test_chat.py # Unit tests for chat endpoint
    ├── agent/
    │   └── test_agent.py # Unit tests for AI agent
    └── integration/
        └── test_chat_integration.py # Integration tests for chat functionality
```

**Structure Decision**: Backend web application structure with dedicated agent module for AI functionality, chat routes for endpoint, and dedicated test suites for both unit and integration testing.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|