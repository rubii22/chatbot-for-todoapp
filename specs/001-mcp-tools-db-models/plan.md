# Implementation Plan: MCP Tools and Database Models

**Branch**: `001-mcp-tools-db-models` | **Date**: 2026-01-22 | **Spec**: [specs/001-mcp-tools-db-models/spec.md](../spec.md)
**Input**: Feature specification from `/specs/001-mcp-tools-db-models/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement MCP tools and database models for the Todo AI Chatbot to enable stateless, user-isolated task operations. This includes creating Conversation and Message models for chat history, and implementing 5 MCP tools (add_task, list_tasks, complete_task, delete_task, update_task) that filter by user_id for security. The implementation will follow the OpenAI Agents SDK patterns but use Cohere SDK for AI operations, maintaining stateless architecture with SQLModel ORM for database interactions.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, SQLModel, Cohere SDK, Official MCP SDK, Better Auth
**Storage**: PostgreSQL (Neon)
**Testing**: pytest
**Target Platform**: Linux server
**Project Type**: backend/single - determines source structure
**Performance Goals**: MCP tools respond to requests in under 1 second for 95% of operations
**Constraints**: All operations must filter by user_id for data isolation, no in-memory state storage, tools must be stateless
**Scale/Scope**: Support multi-user environment with proper data isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-driven development: Following specification in /specs/001-mcp-tools-db-models/spec.md
- ✅ Stateless server architecture: No in-memory state between requests, all data in DB
- ✅ Cohere-powered intelligence: Will integrate Cohere SDK for future AI operations
- ✅ Strict user isolation: All operations will be filtered by user_id
- ✅ OpenAI Agents SDK patterns with Cohere: Following patterns but replacing OpenAI with Cohere
- ✅ Persistent conversation history: Implementing Conversation and Message models

## Project Structure

### Documentation (this feature)
```text
specs/001-mcp-tools-db-models/
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
│   ├── models/
│   │   └── models.py        # Extended with Conversation and Message models
│   ├── mcp/
│   │   ├── __init__.py
│   │   ├── tools.py         # Contains the 5 MCP tools implementation
│   │   └── server.py        # MCP server setup
│   ├── services/
│   └── api/
└── tests/
    ├── mcp/
    │   └── test_tools.py    # Unit tests for MCP tools
    ├── integration/
    │   └── test_db_models.py # Integration tests for DB operations
    └── unit/
        └── test_models.py   # Unit tests for models
```

**Structure Decision**: Backend web application structure with dedicated mcp module for tools, extending existing models.py with new database models, and creating dedicated test suites for both unit and integration testing.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|