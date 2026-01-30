# Chat Endpoint API Contracts

**Date**: 2026-01-22
**Feature**: AI Agent and Chat Endpoint
**Branch**: 001-ai-agent-chat

## Overview

This document defines the API contracts for the chat endpoint that integrates with the Cohere-powered AI agent for task operations.

## Chat Endpoint Contract

### POST /api/{user_id}/chat

**Purpose**: Process user messages through the AI agent and return responses with tool call information.

**Path Parameter**:
- `user_id` (string): The ID of the user sending the message

**Headers**:
- `Authorization` (string, required): Bearer token containing JWT for authentication
- `Content-Type` (string): application/json

**Request Body**:
```json
{
  "message": "string (required)",
  "conversation_id": "integer (optional)"
}
```

**Response**:
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

**Success Response (200 OK)**:
- The message was successfully processed by the AI agent
- The response contains the AI's reply and any tool calls made
- The conversation history is persisted in the database

**Error Responses**:
- `400 Bad Request`: Invalid request body or missing required fields
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: User attempting to access a different user's chat
- `422 Unprocessable Entity`: Malformed request or invalid parameters
- `500 Internal Server Error`: Server error during processing

**Business Logic**:
- Validates JWT token and extracts user_id
- Verifies that path user_id matches token user_id
- Fetches conversation history from database
- Stores user message in database
- Runs Cohere agent with conversation context
- Handles tool calls from agent response
- Stores agent response in database
- Returns response with tool call information

## Cohere Integration Contract

### Cohere Client Configuration

**API Key**: Retrieved from COHERE_API_KEY environment variable

**Chat Parameters**:
- `model`: "command-r-plus" or similar appropriate model
- `message`: User's message combined with conversation history
- `tools`: List of MCP tools available for function calling
- `temperature`: 0.7 for balanced creativity and accuracy

### Tool Definitions for Cohere

Each MCP tool is defined with the following schema for Cohere function calling:

#### add_task Tool Definition
```json
{
  "name": "add_task",
  "description": "Add a new task for a user. Requires user_id and title.",
  "parameter_definitions": {
    "user_id": {
      "type": "str",
      "description": "The ID of the user creating the task"
    },
    "title": {
      "type": "str",
      "description": "The title of the task"
    },
    "description": {
      "type": "str",
      "description": "Optional description of the task"
    }
  }
}
```

#### list_tasks Tool Definition
```json
{
  "name": "list_tasks",
  "description": "List tasks for a user. Filter by status if specified.",
  "parameter_definitions": {
    "user_id": {
      "type": "str",
      "description": "The ID of the user whose tasks to retrieve"
    },
    "status": {
      "type": "str",
      "description": "Filter by status (all, pending, completed); defaults to all"
    }
  }
}
```

#### complete_task Tool Definition
```json
{
  "name": "complete_task",
  "description": "Mark a task as completed.",
  "parameter_definitions": {
    "user_id": {
      "type": "str",
      "description": "The ID of the user owning the task"
    },
    "task_id": {
      "type": "int",
      "description": "The ID of the task to complete"
    }
  }
}
```

#### delete_task Tool Definition
```json
{
  "name": "delete_task",
  "description": "Delete a task.",
  "parameter_definitions": {
    "user_id": {
      "type": "str",
      "description": "The ID of the user owning the task"
    },
    "task_id": {
      "type": "int",
      "description": "The ID of the task to delete"
    }
  }
}
```

#### update_task Tool Definition
```json
{
  "name": "update_task",
  "description": "Update a task's title or description.",
  "parameter_definitions": {
    "user_id": {
      "type": "str",
      "description": "The ID of the user owning the task"
    },
    "task_id": {
      "type": "int",
      "description": "The ID of the task to update"
    },
    "title": {
      "type": "str",
      "description": "New title for the task (optional)"
    },
    "description": {
      "type": "str",
      "description": "New description for the task (optional)"
    }
  }
}
```

## Database Contract

### Conversation Retrieval
- Fetch conversation by ID if provided, or create new conversation
- Retrieve all messages for the conversation ordered by creation time
- Filter by user_id to ensure data isolation

### Message Storage
- Store user message with role "user" and current timestamp
- Store agent response with role "assistant" and current timestamp
- Link messages to conversation ID

## Authentication Contract

### JWT Token Validation
- Verify token signature using BETTER_AUTH_SECRET
- Extract user_id from token payload
- Ensure path user_id matches token user_id
- Validate token expiration

## Error Response Format

Standard error response format for all endpoints:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descriptive error message",
    "details": "Additional error details if applicable"
  }
}
```

## Security Requirements

1. **Authentication**: All requests require valid JWT token in Authorization header
2. **Authorization**: User can only access their own conversations (user_id matching)
3. **Data Isolation**: Users can only access their own conversation history
4. **Input Validation**: All message content is validated and sanitized
5. **Rate Limiting**: Endpoint should implement rate limiting to prevent abuse
6. **API Key Security**: Cohere API key is securely stored in environment variables