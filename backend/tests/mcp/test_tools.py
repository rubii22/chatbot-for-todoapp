"""
Unit tests for MCP tools
"""
import pytest
from backend.src.mcp.tools import add_task, list_tasks, complete_task, delete_task, update_task
from backend.src.models.models import Task, TaskStatus
from backend.src.db import engine
from sqlmodel import Session, select


def setup_test_database():
    """Setup test database with clean state"""
    from backend.src.models.models import SQLModel
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


def test_add_task_success():
    """Test successful task addition"""
    setup_test_database()

    result = add_task(user_id="user123", title="Test Task", description="Test Description")

    assert "task_id" in result
    assert result["status"] == "created"
    assert result["title"] == "Test Task"


def test_add_task_invalid_user():
    """Test adding task with invalid user_id"""
    result = add_task(user_id="", title="Test Task")

    assert "error" in result
    assert result["error"]["code"] == "INVALID_USER_ID"


def test_add_task_missing_title():
    """Test adding task without title"""
    result = add_task(user_id="user123", title="")

    assert "error" in result
    assert result["error"]["code"] == "MISSING_TITLE"


def test_list_tasks_empty():
    """Test listing tasks for a user with no tasks"""
    setup_test_database()

    result = list_tasks(user_id="user123")

    assert isinstance(result, list)
    assert len(result) == 0


def test_list_tasks_with_data():
    """Test listing tasks for a user with existing tasks"""
    setup_test_database()

    # Add a task first
    add_task(user_id="user123", title="Test Task 1")
    add_task(user_id="user123", title="Test Task 2")

    result = list_tasks(user_id="user123")

    assert isinstance(result, list)
    assert len(result) == 2
    assert result[0]["title"] == "Test Task 1"
    assert result[1]["title"] == "Test Task 2"


def test_complete_task_success():
    """Test successfully completing a task"""
    setup_test_database()

    # Add a task first
    add_result = add_task(user_id="user123", title="Test Task")
    task_id = add_result["task_id"]

    # Complete the task
    result = complete_task(user_id="user123", task_id=task_id)

    assert result["task_id"] == task_id
    assert result["status"] == "completed"
    assert result["title"] == "Test Task"


def test_complete_task_not_found():
    """Test completing a non-existent task"""
    setup_test_database()

    result = complete_task(user_id="user123", task_id=999)

    assert "error" in result
    assert result["error"]["code"] == "TASK_NOT_FOUND"


def test_delete_task_success():
    """Test successfully deleting a task"""
    setup_test_database()

    # Add a task first
    add_result = add_task(user_id="user123", title="Test Task")
    task_id = add_result["task_id"]

    # Delete the task
    result = delete_task(user_id="user123", task_id=task_id)

    assert result["task_id"] == task_id
    assert result["status"] == "deleted"
    assert result["title"] == "Test Task"


def test_delete_task_not_found():
    """Test deleting a non-existent task"""
    setup_test_database()

    result = delete_task(user_id="user123", task_id=999)

    assert "error" in result
    assert result["error"]["code"] == "TASK_NOT_FOUND"


def test_update_task_success():
    """Test successfully updating a task"""
    setup_test_database()

    # Add a task first
    add_result = add_task(user_id="user123", title="Old Title")
    task_id = add_result["task_id"]

    # Update the task
    result = update_task(user_id="user123", task_id=task_id, title="New Title")

    assert result["task_id"] == task_id
    assert result["status"] == "updated"
    assert result["title"] == "New Title"


def test_update_task_no_params():
    """Test updating a task without any update parameters"""
    setup_test_database()

    # Add a task first
    add_result = add_task(user_id="user123", title="Test Title")
    task_id = add_result["task_id"]

    # Try to update without any parameters
    result = update_task(user_id="user123", task_id=task_id)

    assert "error" in result
    assert result["error"]["code"] == "NO_UPDATE_PARAMS"


def test_user_isolation():
    """Test that users can only access their own tasks"""
    setup_test_database()

    # Add tasks for different users
    user1_task = add_task(user_id="user1", title="User 1 Task")
    user2_task = add_task(user_id="user2", title="User 2 Task")

    # Each user should only see their own tasks
    user1_tasks = list_tasks(user_id="user1")
    user2_tasks = list_tasks(user_id="user2")

    assert len(user1_tasks) == 1
    assert user1_tasks[0]["title"] == "User 1 Task"

    assert len(user2_tasks) == 1
    assert user2_tasks[0]["title"] == "User 2 Task"