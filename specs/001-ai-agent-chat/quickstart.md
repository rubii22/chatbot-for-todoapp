# Quickstart Guide: AI Agent and Chat Endpoint

**Date**: 2026-01-22
**Feature**: AI Agent and Chat Endpoint
**Branch**: 001-ai-agent-chat

## Overview

This guide provides instructions for setting up and running the AI agent and chat endpoint for the Todo AI Chatbot. The implementation includes a stateless chat endpoint that integrates with Cohere AI to process natural language requests and execute MCP tools for task operations.

## Prerequisites

- Python 3.11+
- PostgreSQL database (Neon or local instance)
- Cohere API key
- pip or uv package manager

## Environment Setup

1. **Set up environment variables**:
   Create a `.env` file in the project root with the following:
   ```env
   DATABASE_URL=postgresql://username:password@localhost/dbname
   COHERE_API_KEY=your_cohere_api_key_here
   BETTER_AUTH_SECRET=your_jwt_secret_here
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   uv sync  # or pip install -r requirements.txt
   ```

## Running the Application

1. **Start the backend server**:
   ```bash
   uv run uvicorn backend.src.main:app --reload
   ```

   Or if using the standard approach:
   ```bash
   uvicorn backend.src.main:app --reload
   ```

2. **Verify the chat endpoint is available**:
   - The chat endpoint should be available at `/api/{user_id}/chat`
   - The endpoint accepts POST requests with JSON payload

## Testing the Chat Endpoint

1. **Send a test message**:
   ```bash
   curl -X POST http://localhost:8000/api/123/chat \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"message": "Add a task to buy groceries"}'
   ```

2. **Expected response**:
   ```json
   {
     "conversation_id": 456,
     "response": "I've added the task 'buy groceries' to your list.",
     "tool_calls": [
       {
         "name": "add_task",
         "arguments": {"user_id": "123", "title": "buy groceries"},
         "result": {"task_id": 789, "status": "created", "title": "buy groceries"}
       }
     ]
   }
   ```

## Using the AI Agent

1. **Natural language commands supported**:
   - "Add a task [title]" → calls `add_task` tool
   - "Show my tasks" → calls `list_tasks` tool
   - "Complete task [id]" → calls `complete_task` tool
   - "Delete task [id]" → calls `delete_task` tool
   - "Update task [id] [new title]" → calls `update_task` tool

2. **Conversation persistence**:
   - Each conversation is stored in the database with history
   - The AI agent has access to conversation context
   - No server-side state is maintained

## Verification Steps

1. **Chat Endpoint**:
   - Verify the endpoint accepts POST requests at `/api/{user_id}/chat`
   - Check that JWT authentication is properly validated
   - Confirm that user_id from token matches the path parameter

2. **Cohere Integration**:
   - Verify the Cohere client is initialized with the API key
   - Check that natural language is properly mapped to MCP tools
   - Confirm that tool responses are incorporated into AI responses

3. **Database Persistence**:
   - Verify conversations and messages are stored in the database
   - Check that conversation history is retrieved for context
   - Confirm user isolation is maintained (users can't access each other's data)

4. **Stateless Operation**:
   - Verify that no session data is stored server-side
   - Confirm that conversations can be resumed after server restart
   - Check that all state is maintained in the database

## Troubleshooting

- **Cohere API Errors**: Verify COHERE_API_KEY is correctly set and has sufficient quota
- **Database Connection Issues**: Check DATABASE_URL is correct and database is accessible
- **Authentication Errors**: Verify JWT tokens are properly formatted and not expired
- **Tool Call Failures**: Check that MCP tools are properly registered and accessible
- **Conversation Persistence**: Verify Conversation and Message models are correctly configured

## Next Steps

1. Integrate with the frontend chat interface
2. Add monitoring and logging for production deployment
3. Implement rate limiting for the chat endpoint
4. Add support for richer response formats and attachments