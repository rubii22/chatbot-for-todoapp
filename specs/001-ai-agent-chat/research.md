# Research: AI Agent and Chat Endpoint Implementation

**Date**: 2026-01-22
**Feature**: AI Agent and Chat Endpoint
**Branch**: 001-ai-agent-chat

## Overview

Research needed to implement the AI agent and chat endpoint for the Todo AI Chatbot. The goal is to understand the current codebase structure and plan the implementation of:
- POST /api/{user_id}/chat endpoint
- Cohere-powered AI agent that maps natural language to MCP tools
- Conversation history persistence and retrieval
- Stateless architecture with database-only state management

## Current Codebase Exploration

Based on the existing backend structure, we have:
- MCP tools already implemented in `backend/src/mcp/tools.py`
- Database models in `backend/src/models/models.py`
- Database connections in `backend/src/db.py`
- The tools are registered via decorators in `backend/src/mcp/server.py`

## Cohere SDK Integration Research

For Cohere integration, we need to understand:
1. How to initialize the Cohere client with COHERE_API_KEY
2. How to use Cohere's chat API for natural language processing
3. How to configure function/tool calling for MCP tool integration
4. How to handle the response and tool calls from Cohere

## Chat Endpoint Architecture

The endpoint needs to:
1. Accept POST requests to `/api/{user_id}/chat`
2. Validate JWT token and extract user_id
3. Fetch conversation history from database
4. Store user message in database
5. Run Cohere agent with conversation history
6. Handle tool calls from Cohere response
7. Store agent response in database
8. Return response with tool call information

## AI Agent Architecture

The agent needs to:
1. Use Cohere's chat/completions API for natural language understanding
2. Be configured with the existing MCP tools as functions
3. Map natural language commands to appropriate MCP tools
4. Handle errors gracefully and return friendly responses
5. Maintain conversation context for natural interaction

## Database Interaction Patterns

Based on the existing models, we need to:
1. Fetch Conversation and associated Messages from DB
2. Create new Message records for user input and agent response
3. Potentially create new Conversation if none exists
4. Use SQLModel sessions for database operations

## Authentication and User Isolation

We need to ensure:
1. JWT token validation using Better Auth
2. User_id extraction from token matches path parameter
3. All database queries filter by user_id for data isolation
4. Proper error handling for authentication failures

## Cohere Function Calling Setup

To integrate with MCP tools, we need to:
1. Define function schemas that match our MCP tools
2. Configure Cohere to recognize these functions
3. Handle the function call responses appropriately
4. Map function call results back to natural language responses

## Implementation Approach

1. **Stateless Architecture**: All state persisted in database, no server-side session memory
2. **User Isolation**: Every operation filtered by user_id to prevent data leaks
3. **Cohere Integration**: Use Cohere SDK for natural language processing and tool calls
4. **Error Handling**: Return appropriate error messages for agent-friendly responses
5. **FastAPI Integration**: Use FastAPI dependencies for authentication and database sessions