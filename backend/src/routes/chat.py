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
        raise HTTPException(status_code=500, detail="Server configuration error: auth secret not set")

    try:
        # Decode the token
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(request: Request) -> str:
    """
    Extract and verify user from authorization header

    Args:
        request: FastAPI request object

    Returns:
        User ID from token
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")

    token = auth_header.split(" ")[1]
    payload = verify_token(token)

    # Extract user_id from payload (assuming it's in 'user_id' field)
    user_id = payload.get("user_id") or payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token: user ID not found")

    return str(user_id)


@router.post("/api/{user_id}/chat")
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    current_user: str = Depends(get_current_user)
):
    """
    Chat endpoint that processes user messages through the OpenRouter AI agent

    Args:
        user_id: The ID of the user from the path
        request: Chat request containing message and optional conversation_id
        current_user: Verified user ID from token (should match path user_id)

    Returns:
        ChatResponse with conversation_id, response, and tool_calls
    """
    # Verify that the user_id in the path matches the user_id from the token
    if user_id != current_user:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized: path user_id does not match token user_id"
        )

    try:
        # Initialize the OpenRouter agent
        agent = OpenRouterAgent()

        # Process the message through the agent
        result = agent.process_message(
            user_id=user_id,
            message_content=request.message,
            conversation_id=request.conversation_id
        )

        # Format tool calls to match the required format: {"name": "...", "args": {...}}
        formatted_tool_calls = [
            {
                "name": tc["name"],
                "args": tc["arguments"]
            }
            for tc in result["tool_calls"]
        ]

        # Prepare response ensuring "response" key exists
        response_text = result.get("response", "Got your message!")

        return {
            "response": response_text,
            "conversation_id": result["conversation_id"],
            "tool_calls": formatted_tool_calls
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