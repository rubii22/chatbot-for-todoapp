# Research: MCP Tools and Database Models Implementation

**Date**: 2026-01-22
**Feature**: MCP Tools and Database Models
**Branch**: 001-mcp-tools-db-models

## Overview

Research needed to implement MCP tools and database models for the Todo AI Chatbot. The goal is to understand the requirements and plan the implementation of:
- Conversation and Message database models
- 5 MCP tools (add_task, list_tasks, complete_task, delete_task, update_task)
- User isolation with user_id filtering
- Statelessness requirements

## Current Codebase Status

After exploring the project structure, I found:
- No existing backend directory
- No existing Python files
- No existing models or database schema
- This is a new project requiring full backend implementation

## MCP Tools Architecture

Based on the specification, we need to implement 5 MCP tools with exact parameters:

1. **add_task**: user_id (str), title (str), description (str optional) → return {"task_id": int, "status": "created", "title": str}
2. **list_tasks**: user_id (str), status (str optional: "all"/"pending"/"completed") → return array of task objects
3. **complete_task**: user_id (str), task_id (int) → return {"task_id": int, "status": "completed", "title": str}
4. **delete_task**: user_id (str), task_id (int) → return {"task_id": int, "status": "deleted", "title": str}
5. **update_task**: user_id (str), task_id (int), title (str optional), description (str optional) → return {"task_id": int, "status": "updated", "title": str}

## Database Model Requirements

The specification requires two new database models:

1. **Conversation** model:
   - id (Primary Key)
   - user_id (Foreign Key to users.id)
   - created_at (timestamp)
   - updated_at (timestamp)
   - Index on user_id

2. **Message** model:
   - id (Primary Key)
   - conversation_id (Foreign Key to conversations.id)
   - role ("user" or "assistant")
   - content (text)
   - created_at (timestamp)
   - Index on conversation_id

## Technology Stack

Following the constitution and spec:
- Python 3.11 with FastAPI
- SQLModel ORM for database operations
- Neon PostgreSQL for database
- Official MCP SDK for tool exposure
- Cohere SDK for future AI operations
- Better Auth for JWT authentication

## Implementation Approach

1. **Stateless Architecture**: All operations must be stateless, no in-memory storage
2. **User Isolation**: Every operation must filter by user_id to prevent data leaks
3. **SQLModel ORM**: Use SQLModel sessions for database operations
4. **Error Handling**: Return appropriate error messages rather than raising exceptions for agent-friendly responses

## Dependencies to Install

Based on the tech stack, we'll need to install:
- fastapi
- sqlmodel
- psycopg2-binary (for PostgreSQL)
- python-multipart
- uvicorn (for running the server)
- cohere
- python-mcp-sdk (Official MCP SDK)

## Security Considerations

- Every tool must validate that the user can only access their own data
- Proper authentication with JWT tokens
- Input validation to prevent injection attacks
- Rate limiting to prevent abuse