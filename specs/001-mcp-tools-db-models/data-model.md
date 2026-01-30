# Data Model: MCP Tools and Database Models

**Date**: 2026-01-22
**Feature**: MCP Tools and Database Models
**Branch**: 001-mcp-tools-db-models

## Overview

Data model specification for the Todo AI Chatbot, defining the database schema for Conversation and Message entities, and extending the Task entity with user isolation capabilities.

## Entity Relationships

```
Users (users table) 1 -> * Conversations (one user can have many conversations)
Conversations 1 -> * Messages (one conversation can have many messages)
Users 1 -> * Tasks (one user can have many tasks)
```

## Database Schema

### Conversation Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the conversation |
| user_id | VARCHAR | FOREIGN KEY (references users.id), NOT NULL | ID of the user who owns this conversation |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the conversation was created |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Timestamp when the conversation was last updated |

**Indexes**:
- idx_user_id: Index on user_id column for efficient user-based queries

### Message Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the message |
| conversation_id | INTEGER | FOREIGN KEY (references conversations.id), NOT NULL | ID of the conversation this message belongs to |
| role | VARCHAR(20) | NOT NULL, CHECK (role IN ('user', 'assistant')) | Role of the message sender (user or assistant) |
| content | TEXT | NOT NULL | Content of the message |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the message was created |

**Indexes**:
- idx_conversation_id: Index on conversation_id column for efficient conversation-based queries

### Task Table (Extended)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the task |
| user_id | VARCHAR | FOREIGN KEY (references users.id), NOT NULL | ID of the user who owns this task |
| title | VARCHAR(255) | NOT NULL | Title of the task |
| description | TEXT | NULL | Detailed description of the task |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending', CHECK (status IN ('pending', 'completed')) | Status of the task |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the task was created |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Timestamp when the task was last updated |

**Indexes**:
- idx_user_id: Index on user_id column for efficient user-based queries
- idx_status: Index on status column for efficient status-based queries

## API Data Structures

### Request Objects

#### Add Task Request
```json
{
  "user_id": "string",
  "title": "string",
  "description": "string (optional)"
}
```

#### List Tasks Request
```json
{
  "user_id": "string",
  "status": "string (optional: 'all', 'pending', 'completed')"
}
```

#### Complete/Update/Delete Task Request
```json
{
  "user_id": "string",
  "task_id": "integer"
}
```

### Response Objects

#### Task Response
```json
{
  "task_id": "integer",
  "status": "string",
  "title": "string"
}
```

#### List Tasks Response
```json
[
  {
    "id": "integer",
    "title": "string",
    "description": "string",
    "status": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

## Constraints and Business Rules

1. **User Isolation**: All operations must be filtered by user_id to prevent unauthorized access
2. **Data Integrity**: Foreign key constraints ensure referential integrity
3. **Validation**: Role column in messages must be either 'user' or 'assistant'
4. **Default Values**: Appropriate default values for timestamps and statuses
5. **Required Fields**: All essential fields are marked as NOT NULL

## Access Patterns

1. **User-centric queries**: Retrieve all conversations/messages/tasks for a specific user
2. **Conversation-centric queries**: Retrieve all messages for a specific conversation
3. **Task status queries**: Retrieve tasks filtered by status for a specific user
4. **Time-based queries**: Sort conversations and messages by creation time