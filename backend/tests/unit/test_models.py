"""
Unit tests for database models
"""
import pytest
from datetime import datetime
from backend.src.models.models import Task, TaskStatus, Conversation, Message, MessageRole


def test_task_model_creation():
    """Test creating a Task model"""
    task = Task(
        user_id="user123",
        title="Test Task",
        description="Test Description",
        status=TaskStatus.pending
    )

    assert task.user_id == "user123"
    assert task.title == "Test Task"
    assert task.description == "Test Description"
    assert task.status == TaskStatus.pending
    assert task.created_at is not None
    assert task.updated_at is not None


def test_task_model_defaults():
    """Test Task model with default values"""
    task = Task(
        user_id="user123",
        title="Test Task"
    )

    assert task.status == TaskStatus.pending
    assert task.description is None


def test_conversation_model_creation():
    """Test creating a Conversation model"""
    conv = Conversation(
        user_id="user123"
    )

    assert conv.user_id == "user123"
    assert conv.created_at is not None
    assert conv.updated_at is not None


def test_message_model_creation():
    """Test creating a Message model"""
    msg = Message(
        conversation_id=1,
        role=MessageRole.user,
        content="Hello, world!"
    )

    assert msg.conversation_id == 1
    assert msg.role == MessageRole.user
    assert msg.content == "Hello, world!"
    assert msg.created_at is not None


def test_task_status_enum():
    """Test TaskStatus enum values"""
    assert TaskStatus.pending.value == "pending"
    assert TaskStatus.completed.value == "completed"

    # Test all possible values
    statuses = [status.value for status in TaskStatus]
    assert "pending" in statuses
    assert "completed" in statuses


def test_message_role_enum():
    """Test MessageRole enum values"""
    assert MessageRole.user.value == "user"
    assert MessageRole.assistant.value == "assistant"

    # Test all possible values
    roles = [role.value for role in MessageRole]
    assert "user" in roles
    assert "assistant" in roles