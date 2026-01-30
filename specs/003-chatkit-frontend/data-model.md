# Data Model: Frontend Chat Interface for Todo AI Chatbot

## Overview
This document defines the data structures and entities for the chatbot frontend feature, focusing on client-side data management and API interactions.

## Client-Side Entities

### ChatMessage
Represents a message in the chat interface

- **id**: string - Unique identifier for the message
- **content**: string - Text content of the message
- **sender**: 'user' | 'assistant' - Who sent the message
- **timestamp**: Date - When the message was sent
- **conversationId**: string - Associated conversation identifier
- **status**: 'sending' | 'sent' | 'delivered' | 'error' - Message delivery status

### ConversationState
Manages the state of a chat conversation

- **conversationId**: string - Unique identifier for the conversation
- **messages**: ChatMessage[] - Array of messages in the conversation
- **isActive**: boolean - Whether the chat window is currently open
- **lastActive**: Date - When the conversation was last accessed

### ChatConfig
Configuration for the chat interface

- **domainKey**: string - NEXT_PUBLIC_OPENAI_DOMAIN_KEY for ChatKit
- **apiEndpoint**: string - Backend API endpoint (/api/{user_id}/chat)
- **authToken**: string - Better Auth JWT token
- **userId**: string - Current user identifier

## API Contracts

### Frontend to Backend Requests

#### Send Message Request
**Endpoint**: POST `/api/{user_id}/chat`
**Headers**:
- Authorization: Bearer {jwt_token}
- Content-Type: application/json

**Request Body**:
```json
{
  "message": "string",
  "conversation_id": "string | null",
  "user_id": "string"
}
```

**Response**:
```json
{
  "conversation_id": "string",
  "response": "string",
  "timestamp": "ISODateString"
}
```

### Backend to Frontend Responses
The backend returns structured responses that the frontend processes for display in the ChatKit interface.

## Component State Models

### ChatWindow State
- **isOpen**: boolean - Whether the chat window is visible
- **isLoading**: boolean - Whether the chat is loading
- **messages**: ChatMessage[] - Current messages in the chat
- **inputValue**: string - Current value in the input field
- **error**: string | null - Any error messages
- **conversationId**: string | null - Current conversation identifier

### ChatbotButton State
- **isVisible**: boolean - Whether the button is displayed
- **hasUnread**: boolean - Whether there are unread messages
- **position**: {bottom: string, right: string} - CSS positioning

## Storage Models

### Browser Storage (localStorage)
- **active_conversation_id**: string - Currently active conversation
- **recent_conversations**: string[] - Recent conversation IDs
- **chat_preferences**: {theme: string, notifications: boolean} - User preferences

## Validation Rules

1. **Message Content**: Must be non-empty string, max 2000 characters
2. **Conversation ID**: Must be valid UUID format when provided
3. **Authentication**: JWT token must be present and valid for all API calls
4. **User Isolation**: User can only access their own conversations
5. **Timestamp**: Must be in ISO format or milliseconds since epoch

## Relationships

- One ConversationState contains many ChatMessage instances
- One ChatConfig is used by one ChatWindow component
- Many ChatMessage instances belong to one ConversationState
- One User has many ConversationState instances