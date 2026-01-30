# Data Model: AI Agent and Chat Endpoint

**Date**: 2026-01-22
**Feature**: AI Agent and Chat Endpoint
**Branch**: 001-ai-agent-chat

## Overview

Data model specification for the AI agent and chat endpoint, defining the conversation flow, data structures, and interaction patterns between the frontend, Cohere AI, MCP tools, and database.

## Conversation Flow Data Structure

```
User Input: "Add a task to buy groceries"
    ↓
Chat Endpoint: /api/{user_id}/chat
    ↓
Fetch Conversation History from DB
    ↓
Cohere Agent Processing
    ↓
Tool Call: add_task(user_id="123", title="buy groceries")
    ↓
Tool Response: {"task_id": 456, "status": "created", "title": "buy groceries"}
    ↓
Cohere Generates Response: "I've added the task 'buy groceries' to your list."
    ↓
Store Response in DB
    ↓
Return: {"conversation_id": 789, "response": "I've added the task 'buy groceries' to your list.", "tool_calls": [{"name": "add_task", "result": {...}}]}
```

## API Data Structures

### Request Objects

#### Chat Request
```json
{
  "message": "string",
  "conversation_id": "integer (optional)"
}
```

#### Cohere Message Format (internal)
```json
{
  "role": "user | assistant",
  "content": "string"
}
```

### Response Objects

#### Chat Response
```json
{
  "conversation_id": "integer",
  "response": "string",
  "tool_calls": [
    {
      "name": "string (tool name)",
      "arguments": "object (tool arguments)",
      "result": "object (tool result)"
    }
  ]
}
```

## Database Query Patterns

### Fetch Conversation with Messages
```sql
SELECT * FROM conversation WHERE id = ? AND user_id = ?
JOIN message ON message.conversation_id = conversation.id
ORDER BY message.created_at ASC
```

### Store User Message
```sql
INSERT INTO message (conversation_id, role, content, created_at)
VALUES (?, 'user', ?, CURRENT_TIMESTAMP)
```

### Store Assistant Response
```sql
INSERT INTO message (conversation_id, role, content, created_at)
VALUES (?, 'assistant', ?, CURRENT_TIMESTAMP)
```

## Cohere Integration Data Flow

### Input to Cohere
```python
messages = [
    {"role": "user", "content": "Previous user message"},
    {"role": "assistant", "content": "Previous assistant response"},
    {"role": "user", "content": "Current user message requesting action"}
]
tools = [
    {
        "name": "add_task",
        "description": "Add a new task for a user. Requires user_id and title.",
        "parameter_definitions": {
            "user_id": {"type": "str", "description": "The ID of the user creating the task"},
            "title": {"type": "str", "description": "The title of the task"},
            "description": {"type": "str", "description": "Optional description of the task"}
        }
    },
    # ... other tools
]
```

### Cohere Response with Tool Calls
```python
{
    "text": "I've added the task 'buy groceries' to your list.",
    "tool_calls": [
        {
            "name": "add_task",
            "parameters": {
                "user_id": "123",
                "title": "buy groceries"
            }
        }
    ]
}
```

## Conversation Context Management

### Conversation State Representation
```python
class ConversationContext:
    id: int
    user_id: str
    messages: List[Message]
    created_at: datetime
    updated_at: datetime

    def add_user_message(self, content: str) -> Message:
        # Create and store user message in DB

    def add_assistant_message(self, content: str) -> Message:
        # Create and store assistant message in DB

    def get_history_for_llm(self) -> List[dict]:
        # Format messages for Cohere API
```

## Error Response Patterns

### Authentication Error
```json
{
  "error": {
    "code": "AUTH_FAILED",
    "message": "Invalid or expired authentication token"
  }
}
```

### Tool Execution Error
```json
{
  "conversation_id": 789,
  "response": "I encountered an issue adding your task. Please try again.",
  "tool_calls": [
    {
      "name": "add_task",
      "arguments": {"user_id": "123", "title": "buy groceries"},
      "result": {"error": "Task creation failed"}
    }
  ]
}
```

## Access Patterns

1. **User-centric queries**: Retrieve conversation history for a specific user
2. **Conversation-centric queries**: Fetch all messages for a specific conversation
3. **Time-based queries**: Sort messages by creation time for chronological order
4. **Role-based queries**: Separate user and assistant messages for context management