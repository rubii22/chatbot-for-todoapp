# Todo AI Chatbot Backend

This backend implements MCP tools and database models for the Todo AI Chatbot, enabling natural language task management through an AI-powered chat interface.

## Features

- **MCP Tools**: 5 MCP tools for task operations (add, list, complete, delete, update)
- **User Isolation**: All operations filtered by user_id to ensure data privacy
- **Stateless Architecture**: No in-memory state between requests, all data in DB
- **Database Models**: Conversation and Message models for chat history

## Architecture

```
backend/
├── src/
│   ├── models/           # Database models (Task, Conversation, Message)
│   ├── mcp/              # MCP tools and server
│   │   ├── tools.py      # MCP tool implementations
│   │   └── server.py     # MCP server implementation
│   ├── db.py             # Database connection and session management
│   └── utils/            # Utility functions (auth, validation)
├── tests/
│   ├── mcp/              # Unit tests for MCP tools
│   ├── unit/             # Unit tests for models
│   └── integration/      # Integration tests
```

## MCP Tools

The backend exposes 5 MCP tools:

1. **add_task**: Add a new task for a user
2. **list_tasks**: List tasks for a user (with optional status filter)
3. **complete_task**: Mark a task as completed
4. **delete_task**: Delete a task
5. **update_task**: Update a task's title or description

All tools enforce user isolation by requiring a user_id parameter and filtering operations by user.

## Database Schema

- **Task**: Stores user tasks with user_id for isolation
- **Conversation**: Stores chat conversations with user_id
- **Message**: Stores individual messages within conversations

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variables:
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost/dbname"
   export COHERE_API_KEY="your_cohere_api_key"
   ```

3. Initialize the database:
   ```python
   from backend.src.models import create_db_and_tables
   create_db_and_tables()
   ```

## Running Tests

```bash
# Run all tests
pytest

# Run specific test files
pytest backend/tests/mcp/test_tools.py
pytest backend/tests/unit/test_models.py
pytest backend/tests/integration/test_db_models.py
```

## Usage

The MCP server can be used by AI agents to perform task operations. Each tool follows the specified contracts and returns structured responses suitable for agent consumption.