# MCP Tools API Contracts

**Date**: 2026-01-22
**Feature**: MCP Tools and Database Models
**Branch**: 001-mcp-tools-db-models

## Overview

This document defines the API contracts for the 5 MCP tools that will be exposed for the Todo AI Chatbot. Each tool follows the MCP protocol specification and enforces user isolation through the user_id parameter.

## Tool Contracts

### 1. add_task

**Purpose**: Creates a new task for a specific user.

**Request Parameters**:
- `user_id` (string, required): The ID of the user creating the task
- `title` (string, required): The title of the task
- `description` (string, optional): Detailed description of the task

**Response**:
```json
{
  "task_id": 123,
  "status": "created",
  "title": "task title"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid parameters (missing required fields)
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: User attempting to create task for another user

**Business Logic**:
- Validates that user_id matches authenticated user
- Creates a new task record associated with the user
- Sets initial status to "pending"

### 2. list_tasks

**Purpose**: Retrieves a list of tasks for a specific user.

**Request Parameters**:
- `user_id` (string, required): The ID of the user whose tasks to retrieve
- `status` (string, optional): Filter by task status ("all", "pending", "completed"; defaults to "all")

**Response**:
```json
[
  {
    "id": 123,
    "title": "task title",
    "description": "task description",
    "status": "pending",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: User attempting to access tasks for another user

**Business Logic**:
- Validates that user_id matches authenticated user
- Filters tasks by user_id
- Optionally filters by status if provided

### 3. complete_task

**Purpose**: Marks a specific task as completed for a user.

**Request Parameters**:
- `user_id` (string, required): The ID of the user owning the task
- `task_id` (integer, required): The ID of the task to complete

**Response**:
```json
{
  "task_id": 123,
  "status": "completed",
  "title": "task title"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid task_id format
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: User attempting to complete task owned by another user
- `404 Not Found`: Task with specified ID not found for the user

**Business Logic**:
- Validates that user_id matches authenticated user
- Verifies that the task belongs to the user
- Updates task status to "completed"

### 4. delete_task

**Purpose**: Deletes a specific task for a user.

**Request Parameters**:
- `user_id` (string, required): The ID of the user owning the task
- `task_id` (integer, required): The ID of the task to delete

**Response**:
```json
{
  "task_id": 123,
  "status": "deleted",
  "title": "task title"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid task_id format
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: User attempting to delete task owned by another user
- `404 Not Found`: Task with specified ID not found for the user

**Business Logic**:
- Validates that user_id matches authenticated user
- Verifies that the task belongs to the user
- Removes the task from the database

### 5. update_task

**Purpose**: Updates the details of a specific task for a user.

**Request Parameters**:
- `user_id` (string, required): The ID of the user owning the task
- `task_id` (integer, required): The ID of the task to update
- `title` (string, optional): New title for the task
- `description` (string, optional): New description for the task

**Response**:
```json
{
  "task_id": 123,
  "status": "updated",
  "title": "new task title"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid task_id format or no update parameters provided
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: User attempting to update task owned by another user
- `404 Not Found`: Task with specified ID not found for the user

**Business Logic**:
- Validates that user_id matches authenticated user
- Verifies that the task belongs to the user
- Updates specified fields only (partial update)
- Preserves unchanged fields

## Common Headers

All tools require the following headers for authentication:
- `Authorization`: Bearer token containing JWT
- `Content-Type`: application/json

## Error Response Format

Standard error response format for all tools:
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

1. **Authentication**: All tools require valid JWT token in Authorization header
2. **Authorization**: All operations must validate that user_id matches authenticated user
3. **Data Isolation**: Users can only access/modify their own data
4. **Input Validation**: All parameters must be validated for type and format
5. **Rate Limiting**: Tools should implement rate limiting to prevent abuse