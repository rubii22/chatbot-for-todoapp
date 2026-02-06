"""
Task endpoints for the Todo AI Chatbot
Handles CRUD operations for tasks
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..mcp.server import call_tool
import os
import jwt

router = APIRouter()


class CreateTaskRequest(BaseModel):
    title: str
    description: Optional[str] = None
    user_id: str


class UpdateTaskRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    user_id: str


class TaskResponse(BaseModel):
    id: int
    user_id: str
    title: str
    description: Optional[str] = None
    status: str
    created_at: str
    updated_at: str


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


async def get_current_user(request: Request) -> str:
    """
    Extract and verify user from authorization header

    Args:
        request: FastAPI request object

    Returns:
        User ID from token
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Authorization header missing or invalid"
        )

    token = auth_header.split(" ")[1]
    payload = verify_token(token)

    # Extract user_id from payload (assuming it's in 'user_id' field)
    user_id = payload.get("user_id") or payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token: user ID not found")

    return str(user_id)


# Create a dependency that allows optional authentication for development
def get_current_user_optional(request: Request) -> str:
    """
    Extract user from authorization header, but allow unauthenticated access for development
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


@router.get("/tasks/")
async def get_tasks(
    request: Request, current_user: str = Depends(get_current_user_optional)
):
    """
    Get all tasks for the current user

    Args:
        request: FastAPI request object
        current_user: Verified user ID from token, or default for dev

    Returns:
        List of tasks for the user
    """
    user_id = current_user

    try:
        # Call the MCP tool to list tasks
        result = call_tool("list_tasks", user_id=user_id)

        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"]["message"])

        return {"tasks": result}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve tasks: {str(e)}"
        )


@router.post("/tasks/")
async def create_task(
    request: CreateTaskRequest, current_user: str = Depends(get_current_user_optional)
):
    """
    Create a new task for the current user

    Args:
        request: CreateTaskRequest containing title and description
        current_user: Verified user ID from token, or default for dev

    Returns:
        Created task details
    """
    user_id = current_user

    try:
        # Call the MCP tool to add a task
        result = call_tool(
            "add_task",
            user_id=user_id,
            title=request.title,
            description=request.description,
        )

        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"]["message"])

        # Get the full task details to return
        full_task_result = call_tool("list_tasks", user_id=user_id, status="all")
        if isinstance(full_task_result, list):
            # Find the task with the ID returned by add_task
            created_task_id = result.get("task_id")
            for task in full_task_result:
                if task.get("id") == created_task_id:
                    return task

        # If we couldn't get full details, return what we have
        return {
            "id": result.get("task_id"),
            "user_id": user_id,
            "title": result.get("title"),
            "description": request.description,
            "status": "pending",
            "created_at": "",
            "updated_at": "",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")


@router.put("/tasks/{task_id}")
async def update_task(
    task_id: int,
    request: UpdateTaskRequest,
    current_user: str = Depends(get_current_user_optional),
):
    """
    Update an existing task for the current user

    Args:
        task_id: ID of the task to update
        request: UpdateTaskRequest containing new title and/or description
        current_user: Verified user ID from token, or default for dev

    Returns:
        Updated task details
    """
    user_id = current_user

    try:
        # Prepare arguments for update
        update_args = {"user_id": user_id, "task_id": task_id}

        if request.title is not None:
            update_args["title"] = request.title
        if request.description is not None:
            update_args["description"] = request.description

        # Call the MCP tool to update the task
        result = call_tool("update_task", **update_args)

        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"]["message"])

        # Get the updated task details
        full_task_result = call_tool("list_tasks", user_id=user_id, status="all")
        if isinstance(full_task_result, list):
            # Find the task with the ID returned by update_task
            updated_task_id = result.get("task_id")
            for task in full_task_result:
                if task.get("id") == updated_task_id:
                    return task

        # If we couldn't get full details, return what we have
        return {
            "id": result.get("task_id"),
            "user_id": user_id,
            "title": result.get("title"),
            "description": request.description,
            "status": "pending",
            "created_at": "",
            "updated_at": "",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update task: {str(e)}")


@router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: int, current_user: str = Depends(get_current_user_optional)
):
    """
    Delete a task for the current user

    Args:
        task_id: ID of the task to delete
        current_user: Verified user ID from token, or default for dev

    Returns:
        Success message
    """
    user_id = current_user

    try:
        # Call the MCP tool to delete the task
        result = call_tool("delete_task", user_id=user_id, task_id=task_id)

        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"]["message"])

        return {"message": "Task deleted successfully", "result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete task: {str(e)}")


@router.patch("/tasks/{task_id}/complete")
async def complete_task(
    task_id: int, current_user: str = Depends(get_current_user_optional)
):
    """
    Mark a task as completed

    Args:
        task_id: ID of the task to mark as completed
        current_user: Verified user ID from token, or default for dev

    Returns:
        Updated task details
    """
    user_id = current_user

    try:
        # Call the MCP tool to complete the task
        result = call_tool("complete_task", user_id=user_id, task_id=task_id)

        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"]["message"])

        # Get the updated task details
        full_task_result = call_tool("list_tasks", user_id=user_id, status="all")
        if isinstance(full_task_result, list):
            # Find the task with the ID returned by complete_task
            completed_task_id = result.get("task_id")
            for task in full_task_result:
                if task.get("id") == completed_task_id:
                    return task

        # If we couldn't get full details, return what we have
        return {
            "id": result.get("task_id"),
            "user_id": user_id,
            "title": result.get("title"),
            "description": "",
            "status": "completed",
            "created_at": "",
            "updated_at": "",
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to complete task: {str(e)}"
        )
