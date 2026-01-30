<!--
Sync Impact Report:
- Version change: 1.0.0 → 2.0.0
- Modified principles: All principles replaced with Todo AI Chatbot specific principles
- Added sections: Tech Stack Standards, Development Workflow
- Removed sections: None
- Templates requiring updates: ✅ Updated / ❗ Pending
- Follow-up TODOs: None
-->
# Todo AI Chatbot Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All development follows Claude Code and Spec-Kit Plus methodologies with modular, traceable implementation; Every feature must have a corresponding spec in /specs/ before implementation begins; Implementation strictly adheres to spec requirements with traceable links between code and specifications.

### II. Stateless Server Architecture
Backend services maintain no in-memory state between requests; All application state is persisted in Neon PostgreSQL database; Services handle restarts gracefully and scale horizontally without shared memory; Session and conversation data stored in DB for resume capability.

### III. Cohere-Powered Intelligence
Natural language understanding implemented via Cohere LLM (not OpenAI) for cost-efficiency and performance; All AI/agent calls use Cohere SDK with appropriate models (e.g., command-r-plus); Environment variables properly configured with COHERE_API_KEY for all LLM operations.

### IV. Strict User Isolation
All operations filtered by authenticated user's ID using Better Auth JWT tokens; Users can only access, view, or modify their own data; Authentication middleware validates JWT tokens in all protected endpoints; No cross-user data leakage permitted.

### V. OpenAI Agents SDK Patterns with Cohere
Follow OpenAI Agents SDK code structure and patterns (agent, runner, tools) but replace OpenAI API calls with Cohere SDK calls; Maintain familiar development patterns while leveraging Cohere's capabilities; Preserve agent-like architecture with state management and tool calling patterns.

### VI. Persistent Conversation History
Conversation history maintained in database for stateless requests and resume capability; All chat interactions stored in Conversation and Message tables; Users can reconnect to ongoing conversations and maintain context across sessions.

## Tech Stack Standards
Technology stack requirements: Frontend - OpenAI ChatKit (UI only), Backend - Python FastAPI, AI - Cohere SDK, MCP - Official MCP SDK, ORM - SQLModel, DB - Neon PostgreSQL, Auth - Better Auth; No OpenAI API calls permitted - only Cohere models; Monorepo structure with /frontend, /backend, and /specs directories; Environment variables properly configured (COHERE_API_KEY, DATABASE_URL, BETTER_AUTH_SECRET, NEXT_PUBLIC_API_URL).

## Development Workflow
Development workflow: Update specs first in /specs/, then implement via Claude Code references with precise file citations; All features reference specs in /specs/ (e.g., @specs/features/mcp-tools.md, @specs/features/chatbot-agent.md); MCP tools expose task operations (add, list, complete, delete, update) with exact parameters/returns as defined; Testing validates user isolation, tool calls, conversation persistence, error responses.

## Security & Compliance
Security requirements: All endpoints protected with JWT, no direct DB access from frontend; Authentication: Better Auth JWT tokens verified in FastAPI middleware; Code patterns follow backend CLAUDE.md (FastAPI, SQLModel, routes/, db.py); Domain allowlist configured for hosted ChatKit (OpenAI security).

## Governance
All development must comply with established architecture patterns; Amendments to constitution require explicit documentation and team approval; MCP tools must expose exact task operations as specified in feature specs; Project follows Phase III basic level implementation without advanced features like voice/multimodal.

**Version**: 2.0.0 | **Ratified**: 2026-01-22 | **Last Amended**: 2026-01-22
