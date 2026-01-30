# API Contract: Chat Interface for Todo AI Chatbot

## Overview
This document defines the API contract between the frontend chat interface and the backend chat service.

## Base URL
```
/api/{user_id}/chat
```

## Authentication
All requests must include a valid Better Auth JWT token in the Authorization header:
```
Authorization: Bearer {jwt_token}
```

## Endpoints

### Send Message
**Method**: POST
**Path**: `/api/{user_id}/chat`
**Description**: Sends a message to the AI assistant and receives a response

#### Request Headers
```
Authorization: Bearer {valid_jwt_token}
Content-Type: application/json
```

#### Path Parameters
- `{user_id}`: The authenticated user's unique identifier

#### Request Body
```json
{
  "message": "string",
  "conversation_id": "string | null",
  "timestamp": "ISODateString (optional)"
}
```

**Fields**:
- `message`: The user's message content (required, max 2000 characters)
- `conversation_id`: ID of existing conversation to continue, or null for new conversation (optional)
- `timestamp`: Client-side timestamp for message ordering (optional, server will add if missing)

#### Response
**Success Response (200 OK)**:
```json
{
  "conversation_id": "string",
  "response": "string",
  "timestamp": "ISODateString",
  "user_id": "string",
  "message_id": "string"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request body or missing required fields
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: User attempting to access another user's chat
- `429 Too Many Requests`: Rate limiting exceeded
- `500 Internal Server Error`: Server error processing request

#### Example Request
```json
{
  "message": "Create a task to buy groceries",
  "conversation_id": "conv_abc123xyz"
}
```

#### Example Response
```json
{
  "conversation_id": "conv_abc123xyz",
  "response": "I've created a task 'buy groceries' for you.",
  "timestamp": "2026-01-28T10:30:00.000Z",
  "user_id": "user_12345",
  "message_id": "msg_def456uvw"
}
```

### Get Conversation History
**Method**: GET
**Path**: `/api/{user_id}/chat/{conversation_id}`
**Description**: Retrieves the history of messages in a specific conversation

#### Request Headers
```
Authorization: Bearer {valid_jwt_token}
```

#### Path Parameters
- `{user_id}`: The authenticated user's unique identifier
- `{conversation_id}`: The conversation identifier to retrieve

#### Response
**Success Response (200 OK)**:
```json
{
  "conversation_id": "string",
  "messages": [
    {
      "message_id": "string",
      "content": "string",
      "sender": "user | assistant",
      "timestamp": "ISODateString"
    }
  ],
  "created_at": "ISODateString",
  "updated_at": "ISODateString"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: User attempting to access another user's chat
- `404 Not Found`: Conversation does not exist
- `500 Internal Server Error`: Server error retrieving conversation

## Error Handling

### Common Error Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### Common Error Codes
- `INVALID_REQUEST`: Request body validation failed
- `AUTHENTICATION_FAILED`: Invalid or expired JWT token
- `UNAUTHORIZED_ACCESS`: User attempting to access resources they don't own
- `CONVERSATION_NOT_FOUND`: Referenced conversation does not exist
- `RATE_LIMIT_EXCEEDED`: Too many requests from the same user
- `BACKEND_SERVICE_ERROR`: Error communicating with AI service
- `INTERNAL_ERROR`: Unexpected server error

## Rate Limiting
- Per-user rate limit: 100 requests per minute
- Burst allowance: Up to 20 requests in 1-second window

## Security Considerations
1. All requests must be authenticated with valid JWT token
2. User isolation: Users can only access their own conversations
3. Input sanitization: All message content is sanitized before processing
4. HTTPS required for all API communications
5. Rate limiting to prevent abuse

## Performance Requirements
- API response time: <500ms for 95% of requests
- Availability: 99.9% uptime
- Connection timeout: 30 seconds