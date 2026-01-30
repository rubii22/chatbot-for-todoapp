"""
MCP Tools for the Todo AI Chatbot
Implementing 5 tools: add_task, list_tasks, complete_task, delete_task, update_task
All tools follow the exact parameters and return formats specified in the contracts
"""
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlmodel import Session, select
from ..models.models import Task, TaskStatus
from ..db import get_session, engine
from ..utils.auth_utils import validate_user_id, sanitize_input
try:
    from mcp import tool
except ImportError:
    # Fallback decorator when real MCP SDK is not available
    def tool(name, description, parameters):
        def decorator(func):
            # Attach metadata to the function for identification
            func._mcp_metadata = {
                "name": name,
                "description": description,
                "parameters": parameters
            }
            return func
        return decorator


@tool(
    name="add_task",
    description="Add a new task for a user. Requires user_id and title.",
    parameters={
        "type": "object",
        "properties": {
            "user_id": {"type": "string", "description": "The ID of the user creating the task"},
            "title": {"type": "string", "description": "The title of the task"},
            "description": {"type": "string", "description": "Optional description of the task"}
        },
        "required": ["user_id", "title"]
    }
)
def add_task(user_id: str, title: str, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Add a new task for a user

    Args:
        user_id: The ID of the user creating the task
        title: The title of the task
        description: Optional description of the task

    Returns:
        Dictionary with task_id, status, and title
    """
    # Validate user_id
    if not validate_user_id(user_id):
        return {"error": {"code": "INVALID_USER_ID", "message": "Invalid user ID provided"}}

    # Sanitize inputs
    title = sanitize_input(title)
    if description:
        description = sanitize_input(description)

    # Validate required parameters
    if not title:
        return {"error": {"code": "MISSING_TITLE", "message": "Title is required"}}

    # Create new task
    new_task = Task(
        user_id=user_id,
        title=title,
        description=description,
        status=TaskStatus.pending
    )

    # Save to database
    with Session(engine) as session:
        session.add(new_task)
        session.commit()
        session.refresh(new_task)

        return {
            "task_id": new_task.id,
            "status": "created",
            "title": new_task.title
        }


@tool(
    name="list_tasks",
    description="List tasks for a user. Filter by status if specified.",
    parameters={
        "type": "object",
        "properties": {
            "user_id": {"type": "string", "description": "The ID of the user whose tasks to retrieve"},
            "status": {"type": "string", "description": "Filter by status (all, pending, completed); defaults to all"}
        },
        "required": ["user_id"]
    }
)
def list_tasks(user_id: str, status: Optional[str] = "all") -> List[Dict[str, Any]]:
    """
    List tasks for a user

    Args:
        user_id: The ID of the user whose tasks to retrieve
        status: Filter by status ("all", "pending", "completed"); defaults to "all"

    Returns:
        List of task dictionaries
    """
    # Validate user_id
    if not validate_user_id(user_id):
        return []

    # Create database session
    with Session(engine) as session:
        # Build query
        query = select(Task).where(Task.user_id == user_id)

        # Apply status filter if specified
        if status and status != "all":
            try:
                status_enum = TaskStatus(status.lower())
                query = query.where(Task.status == status_enum)
            except ValueError:
                # Invalid status, default to all
                pass

        # Execute query
        tasks = session.exec(query).all()

        # Convert to dictionary format
        result = []
        for task in tasks:
            result.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status.value,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat()
            })

        return result


@tool(
    name="complete_task",
    description="Mark a task as completed.",
    parameters={
        "type": "object",
        "properties": {
            "user_id": {"type": "string", "description": "The ID of the user owning the task"},
            "task_id": {"type": "integer", "description": "The ID of the task to complete"}
        },
        "required": ["user_id", "task_id"]
    }
)
def complete_task(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Mark a task as completed

    Args:
        user_id: The ID of the user owning the task
        task_id: The ID of the task to complete

    Returns:
        Dictionary with task_id, status, and title
    """
    # Validate user_id
    if not validate_user_id(user_id):
        return {"error": {"code": "INVALID_USER_ID", "message": "Invalid user ID provided"}}

    # Validate task_id
    if not isinstance(task_id, int) or task_id <= 0:
        return {"error": {"code": "INVALID_TASK_ID", "message": "Invalid task ID provided"}}

    # Update task in database
    with Session(engine) as session:
        # Find the task that belongs to this user
        statement = select(Task).where(Task.user_id == user_id).where(Task.id == task_id)
        task = session.exec(statement).first()

        if not task:
            return {"error": {"code": "TASK_NOT_FOUND", "message": f"Task with ID {task_id} not found for user {user_id}"}}

        # Update task status
        task.status = TaskStatus.completed
        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "task_id": task.id,
            "status": "completed",
            "title": task.title
        }


@tool(
    name="delete_task",
    description="Delete a task.",
    parameters={
        "type": "object",
        "properties": {
            "user_id": {"type": "string", "description": "The ID of the user owning the task"},
            "task_id": {"type": "integer", "description": "The ID of the task to delete"}
        },
        "required": ["user_id", "task_id"]
    }
)
def delete_task(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Delete a task

    Args:
        user_id: The ID of the user owning the task
        task_id: The ID of the task to delete

    Returns:
        Dictionary with task_id, status, and title
    """
    # Validate user_id
    if not validate_user_id(user_id):
        return {"error": {"code": "INVALID_USER_ID", "message": "Invalid user ID provided"}}

    # Validate task_id
    if not isinstance(task_id, int) or task_id <= 0:
        return {"error": {"code": "INVALID_TASK_ID", "message": "Invalid task ID provided"}}

    # Delete task from database
    with Session(engine) as session:
        # Find the task that belongs to this user
        statement = select(Task).where(Task.user_id == user_id).where(Task.id == task_id)
        task = session.exec(statement).first()

        if not task:
            return {"error": {"code": "TASK_NOT_FOUND", "message": f"Task with ID {task_id} not found for user {user_id}"}}

        # Store title before deletion for response
        task_title = task.title

        # Delete the task
        session.delete(task)
        session.commit()

        return {
            "task_id": task_id,
            "status": "deleted",
            "title": task_title
        }


@tool(
    name="update_task",
    description="Update a task's title or description.",
    parameters={
        "type": "object",
        "properties": {
            "user_id": {"type": "string", "description": "The ID of the user owning the task"},
            "task_id": {"type": "integer", "description": "The ID of the task to update"},
            "title": {"type": "string", "description": "New title for the task (optional)"},
            "description": {"type": "string", "description": "New description for the task (optional)"}
        },
        "required": ["user_id", "task_id"]
    }
)
def update_task(user_id: str, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Update a task

    Args:
        user_id: The ID of the user owning the task
        task_id: The ID of the task to update
        title: New title (optional)
        description: New description (optional)

    Returns:
        Dictionary with task_id, status, and title
    """
    # Validate user_id
    if not validate_user_id(user_id):
        return {"error": {"code": "INVALID_USER_ID", "message": "Invalid user ID provided"}}

    # Validate task_id
    if not isinstance(task_id, int) or task_id <= 0:
        return {"error": {"code": "INVALID_TASK_ID", "message": "Invalid task ID provided"}}

    # Check if at least one update parameter is provided
    if title is None and description is None:
        return {"error": {"code": "NO_UPDATE_PARAMS", "message": "At least one parameter (title or description) must be provided for update"}}

    # Sanitize inputs
    if title:
        title = sanitize_input(title)
    if description:
        description = sanitize_input(description)

    # Update task in database
    with Session(engine) as session:
        # Find the task that belongs to this user
        statement = select(Task).where(Task.user_id == user_id).where(Task.id == task_id)
        task = session.exec(statement).first()

        if not task:
            return {"error": {"code": "TASK_NOT_FOUND", "message": f"Task with ID {task_id} not found for user {user_id}"}}

        # Update task fields if provided
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description

        # Update the timestamp
        task.updated_at = datetime.utcnow()

        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "task_id": task.id,
            "status": "updated",
            "title": task.title
        }