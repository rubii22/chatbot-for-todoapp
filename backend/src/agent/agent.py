"""
OpenRouter-powered AI agent for the Todo AI Chatbot
Handles natural language processing and MCP tool integration
"""
import os
import json
from openai import OpenAI
from typing import Dict, Any, List, Optional
from sqlmodel import Session, select
from ..models.models import Message, MessageRole, Conversation
try:
    from ..mcp.server import call_tool
except ImportError:
    # Fallback for testing without MCP server
    def call_tool(tool_name, **kwargs):
        # Mock implementation for testing
        return {"status": "mocked", "tool": tool_name, "params": kwargs}
from ..db import get_session, engine
import asyncio


class OpenRouterAgent:
    """
    AI agent powered by OpenRouter that processes natural language and maps to MCP tools
    """

    def __init__(self):
        """Initialize the OpenAI client with OpenRouter API key from environment"""
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is required")

        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key
        )

        # Define the tools available to the agent in OpenAI format
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task for a user. Requires user_id and title.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user creating the task"
                            },
                            "title": {
                                "type": "string",
                                "description": "The title of the task"
                            },
                            "description": {
                                "type": "string",
                                "description": "Optional description of the task"
                            }
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List tasks for a user. Filter by status if specified.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user whose tasks to retrieve"
                            },
                            "status": {
                                "type": "string",
                                "description": "Filter by status (all, pending, completed); defaults to all"
                            }
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Mark a task as completed.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user owning the task"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to complete"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user owning the task"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to delete"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update a task's title or description.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user owning the task"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to update"
                            },
                            "title": {
                                "type": "string",
                                "description": "New title for the task (optional)"
                            },
                            "description": {
                                "type": "string",
                                "description": "New description for the task (optional)"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            }
        ]

    def process_message(
        self,
        user_id: str,
        message_content: str,
        conversation_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Process a user message and return AI response with tool calls

        Args:
            user_id: The ID of the user sending the message
            message_content: The user's message content
            conversation_id: Optional conversation ID to continue existing conversation

        Returns:
            Dictionary with response, conversation_id, and tool_calls
        """
        # Get conversation history
        conversation, messages = self._get_conversation_history(user_id, conversation_id)

        # Format messages for OpenAI
        openai_messages = []

        # Add system message to guide the AI behavior
        openai_messages.append({
            "role": "system",
            "content": "You are a helpful AI assistant that helps users manage their tasks. Use the available functions to add, list, complete, update, or delete tasks as requested by the user."
        })

        # Add conversation history
        for msg in messages:
            role = "user" if msg.role == MessageRole.user else "assistant"
            openai_messages.append({
                "role": role,
                "content": msg.content
            })

        # Add the new user message
        openai_messages.append({
            "role": "user",
            "content": message_content
        })

        # Call OpenAI with tools
        try:
            response = self.client.chat.completions.create(
                model="openrouter/auto",  # Using OpenRouter's auto-routing model
                messages=openai_messages,
                tools=self.tools,
                tool_choice="auto",  # Let the model decide when to use tools
                temperature=0.7
            )

            # Process tool calls if any
            tool_calls = []

            # Check if the response has tool calls
            if response.choices[0].message.tool_calls:
                for tool_call in response.choices[0].message.tool_calls:
                    # Parse the function arguments
                    args = json.loads(tool_call.function.arguments)

                    # Add the user_id to the arguments
                    args['user_id'] = user_id

                    # Call the MCP tool
                    result = call_tool(tool_call.function.name, **args)

                    # Record the tool call
                    tool_calls.append({
                        "name": tool_call.function.name,
                        "arguments": args,
                        "result": result
                    })

                    # Send the tool result back to the model for a final response
                    openai_messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": tool_call.function.name,
                        "content": json.dumps(result)
                    })

                # Get the final response from the model after processing tool calls
                if tool_calls:
                    final_response = self.client.chat.completions.create(
                        model="openrouter/auto",
                        messages=openai_messages,
                        temperature=0.7
                    )
                    response_text = final_response.choices[0].message.content
                else:
                    response_text = response.choices[0].message.content

            else:
                # If no tool calls were made, just get the text response
                response_text = response.choices[0].message.content or ""

            # Save the user message
            self._save_message(conversation.id, MessageRole.user, message_content)

            # Save the assistant response
            self._save_message(conversation.id, MessageRole.assistant, response_text)

            return {
                "conversation_id": conversation.id,
                "response": response_text,
                "tool_calls": tool_calls
            }

        except Exception as e:
            # Handle errors gracefully
            error_response = f"I encountered an issue processing your request: {str(e)}"

            # Save the user message
            self._save_message(conversation.id, MessageRole.user, message_content)

            # Save the error response
            self._save_message(conversation.id, MessageRole.assistant, error_response)

            return {
                "conversation_id": conversation.id,
                "response": error_response,
                "tool_calls": []
            }

    def _get_conversation_history(self, user_id: str, conversation_id: Optional[int] = None):
        """Retrieve conversation history from database"""
        with Session(engine) as session:
            if conversation_id:
                # Get existing conversation
                conversation = session.get(Conversation, conversation_id)
                if not conversation or conversation.user_id != user_id:
                    raise ValueError("Conversation not found or does not belong to user")
            else:
                # Create new conversation
                conversation = Conversation(user_id=user_id)
                session.add(conversation)
                session.commit()
                session.refresh(conversation)

            # Get all messages for this conversation
            statement = select(Message).where(
                Message.conversation_id == conversation.id
            ).order_by(Message.created_at)

            messages = session.exec(statement).all()

            return conversation, messages

    def _save_message(self, conversation_id: int, role: MessageRole, content: str):
        """Save a message to the database"""
        with Session(engine) as session:
            message = Message(
                conversation_id=conversation_id,
                role=role,
                content=content
            )
            session.add(message)
            session.commit()