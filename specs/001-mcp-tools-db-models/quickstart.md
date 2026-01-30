# Quickstart Guide: MCP Tools and Database Models

**Date**: 2026-01-22
**Feature**: MCP Tools and Database Models
**Branch**: 001-mcp-tools-db-models

## Overview

This guide provides instructions for setting up and running the MCP tools and database models for the Todo AI Chatbot. The implementation includes Conversation and Message models for chat history, and 5 MCP tools for task operations with user isolation.

## Prerequisites

- Python 3.11+
- PostgreSQL database (Neon or local instance)
- pip package manager

## Environment Setup

1. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install fastapi sqlmodel psycopg2-binary python-multipart uvicorn cohere python-mcp-sdk python-jose[cryptography] passlib[bcrypt] python-dotenv
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root with the following:
   ```env
   DATABASE_URL=postgresql://username:password@localhost/dbname
   COHERE_API_KEY=your_cohere_api_key_here
   BETTER_AUTH_SECRET=your_jwt_secret_here
   ```

## Database Setup

1. **Initialize the database**:
   ```bash
   # Run database migrations or create tables
   python -c "
   from backend.src.models import create_db_and_tables
   create_db_and_tables()
   "
   ```

2. **Verify database connection**:
   ```bash
   # Check that tables were created successfully
   python -c "
   from backend.src.models import engine, Conversation, Message, Task
   from sqlmodel import inspect
   insp = inspect(engine)
   print('Tables:', insp.get_table_names())
   "
   ```

## Running the MCP Server

1. **Start the MCP server**:
   ```bash
   uvicorn backend.mcp.server:app --reload
   ```

2. **Verify MCP tools are available**:
   - The server should expose the 5 MCP tools: add_task, list_tasks, complete_task, delete_task, update_task
   - Tools can be accessed via the MCP protocol

## Testing the Tools

1. **Test add_task tool**:
   ```python
   # Example usage
   result = add_task(user_id="user123", title="Buy groceries", description="Milk, eggs, bread")
   print(result)  # Expected: {"task_id": 1, "status": "created", "title": "Buy groceries"}
   ```

2. **Test list_tasks tool**:
   ```python
   # Example usage
   tasks = list_tasks(user_id="user123", status="all")
   print(tasks)  # Expected: Array of task objects
   ```

3. **Test complete_task tool**:
   ```python
   # Example usage
   result = complete_task(user_id="user123", task_id=1)
   print(result)  # Expected: {"task_id": 1, "status": "completed", "title": "Buy groceries"}
   ```

## Verification Steps

1. **Database Models**:
   - Verify Conversation table exists with columns: id, user_id, created_at, updated_at
   - Verify Message table exists with columns: id, conversation_id, role, content, created_at
   - Verify Task table has user_id column for user isolation

2. **MCP Tools**:
   - All 5 tools should be accessible via MCP protocol
   - Tools should filter by user_id to ensure data isolation
   - Tools should return proper response formats as specified

3. **User Isolation**:
   - User A should not be able to access User B's tasks
   - User A should not be able to access User B's conversations or messages

## Troubleshooting

- **Database Connection Issues**: Verify DATABASE_URL is correct and database is running
- **Tool Not Found**: Ensure MCP server is running and tools are properly registered
- **User Isolation Failures**: Check that all queries filter by user_id parameter
- **Authentication Errors**: Verify JWT tokens are properly validated

## Next Steps

1. Integrate with the Cohere-powered AI agent
2. Connect to the chat endpoint for natural language processing
3. Add monitoring and logging for production deployment