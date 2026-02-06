"""
Chat endpoint for the Todo AI Chatbot
Handles POST /api/{user_id}/chat requests
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..agent.agent import OpenRouterAgent
from ..db import get_conversation_history, save_message
import os
import jwt


router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: int
    tool_calls: List[Dict[str, Any]]


def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify JWT token and extract user information

    Args:
        token: JWT token to verify

    Returns:
        Decoded token payload
    """
    secret = os.getenv("BETTER_AUTH_SECRET")
    if not secret:
        raise HTTPException(
            status_code=500, detail="Server configuration error: auth secret not set"
        )

    try:
        # Decode the token
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Create a dependency that allows optional authentication
def get_current_user_optional(request: Request) -> str:
    """
    Extract user from authorization header, but allow unauthenticated access
    """
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            import jwt
            import os

            secret = os.getenv("BETTER_AUTH_SECRET")
            if secret:
                payload = jwt.decode(token, secret, algorithms=["HS256"])
                user_id = payload.get("user_id") or payload.get("sub")
                if user_id:
                    return str(user_id)
        except (jwt.ExpiredSignatureError, jwt.PyJWTError):
            pass

    # Return a default user ID for development
    return "dev-user"


@router.post("/api/{user_id}/chat")
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    current_user: str = Depends(get_current_user_optional),
):
    """
    Chat endpoint that processes user messages through the OpenRouter AI agent

    Args:
        user_id: The ID of the user from the path (used for routing)
        request: Chat request containing message and optional conversation_id
        current_user: Verified user ID from token, or default for dev (used for actual processing)

    Returns:
        Simplified response dict
    """
    # Use the verified user from token instead of requiring exact match
    # This allows the frontend to use whatever user ID format it needs
    verified_user_id = current_user

    try:
        # Initialize the OpenRouter agent
        agent = OpenRouterAgent()

        # Process the message through the agent using the verified user ID
        result = agent.process_message(
            user_id=verified_user_id,
            message_content=request.message,
            conversation_id=request.conversation_id,
        )

        # Format tool calls if they exist
        formatted_tool_calls = []
        if result.get("tool_calls"):
            formatted_tool_calls = [
                {
                    "id": f"call_{__import__('uuid').uuid4().hex[:8]}",
                    "type": "function",
                    "function": {
                        "name": tc["name"],
                        "arguments": __import__("json").dumps(
                            tc.get("args", tc.get("arguments", {}))
                        ),
                    },
                }
                for tc in result["tool_calls"]
            ]

        # Return simple dict format instead of ChatResponse model
        return {
            "response": result.get("response", "Got your message!"),
            "conversation_id": result["conversation_id"],
            "tool_calls": formatted_tool_calls,
        }

    except ValueError as e:
        if "Conversation not found" in str(e):
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# For backward compatibility with the existing structure
def setup_auth_dependency():
    """
    Set up authentication dependency for the chat endpoint
    """
    pass
