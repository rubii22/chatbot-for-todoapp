"""
Integration tests for database models
"""
import pytest
from datetime import datetime
from backend.src.models.models import Task, TaskStatus, Conversation, Message, MessageRole
from backend.src.db import engine, get_session
from sqlmodel import Session, select


def setup_test_database():
    """Setup test database with clean state"""
    from backend.src.models.models import SQLModel
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


def test_task_crud_operations():
    """Test Create, Read, Update, Delete operations for Task model"""
    setup_test_database()

    with Session(engine) as session:
        # CREATE
        new_task = Task(
            user_id="user123",
            title="Test Task",
            description="Test Description",
            status=TaskStatus.pending
        )
        session.add(new_task)
        session.commit()
        session.refresh(new_task)

        assert new_task.id is not None
        assert new_task.title == "Test Task"

        # READ
        statement = select(Task).where(Task.id == new_task.id)
        retrieved_task = session.exec(statement).first()

        assert retrieved_task is not None
        assert retrieved_task.title == "Test Task"
        assert retrieved_task.user_id == "user123"

        # UPDATE
        retrieved_task.title = "Updated Task"
        retrieved_task.status = TaskStatus.completed
        session.add(retrieved_task)
        session.commit()

        # Verify update
        updated_statement = select(Task).where(Task.id == new_task.id)
        updated_task = session.exec(updated_statement).first()

        assert updated_task.title == "Updated Task"
        assert updated_task.status == TaskStatus.completed

        # DELETE
        session.delete(updated_task)
        session.commit()

        # Verify deletion
        deleted_statement = select(Task).where(Task.id == new_task.id)
        deleted_task = session.exec(deleted_statement).first()

        assert deleted_task is None


def test_conversation_message_relationship():
    """Test the relationship between Conversation and Message models"""
    setup_test_database()

    with Session(engine) as session:
        # CREATE conversation
        conversation = Conversation(user_id="user123")
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

        assert conversation.id is not None

        # CREATE messages for the conversation
        message1 = Message(
            conversation_id=conversation.id,
            role=MessageRole.user,
            content="Hello"
        )
        message2 = Message(
            conversation_id=conversation.id,
            role=MessageRole.assistant,
            content="Hi there!"
        )

        session.add(message1)
        session.add(message2)
        session.commit()
        session.refresh(message1)
        session.refresh(message2)

        # VERIFY relationship (reading messages for conversation)
        conversation_statement = select(Conversation).where(Conversation.id == conversation.id)
        conversation_with_messages = session.exec(conversation_statement).first()

        # Note: For this test, we're not using relationships since we created a simpler model
        # Just verify the messages exist and are linked to the conversation
        messages_statement = select(Message).where(Message.conversation_id == conversation.id)
        messages = session.exec(messages_statement).all()

        assert len(messages) == 2
        assert messages[0].conversation_id == conversation.id
        assert messages[1].conversation_id == conversation.id


def test_user_isolation_in_tasks():
    """Test that tasks are properly isolated by user_id"""
    setup_test_database()

    with Session(engine) as session:
        # CREATE tasks for different users
        task1 = Task(user_id="user1", title="User 1 Task", status=TaskStatus.pending)
        task2 = Task(user_id="user2", title="User 2 Task", status=TaskStatus.pending)
        task3 = Task(user_id="user1", title="Another User 1 Task", status=TaskStatus.completed)

        session.add(task1)
        session.add(task2)
        session.add(task3)
        session.commit()

        # VERIFY user isolation
        user1_statement = select(Task).where(Task.user_id == "user1")
        user1_tasks = session.exec(user1_statement).all()

        user2_statement = select(Task).where(Task.user_id == "user2")
        user2_tasks = session.exec(user2_statement).all()

        assert len(user1_tasks) == 2
        assert len(user2_tasks) == 1

        # Check that user 1 tasks have correct titles
        user1_titles = {task.title for task in user1_tasks}
        expected_user1_titles = {"User 1 Task", "Another User 1 Task"}
        assert user1_titles == expected_user1_titles

        # Check that user 2 task has correct title
        assert user2_tasks[0].title == "User 2 Task"


def test_timestamps_auto_generation():
    """Test that created_at and updated_at timestamps are automatically generated"""
    setup_test_database()

    with Session(engine) as session:
        # CREATE task
        before_create = datetime.utcnow()
        task = Task(user_id="user123", title="Timestamp Test")
        session.add(task)
        session.commit()
        session.refresh(task)
        after_create = datetime.utcnow()

        # VERIFY timestamps
        assert task.created_at is not None
        assert task.updated_at is not None
        assert before_create <= task.created_at <= after_create

        # UPDATE task and check updated_at changes
        before_update = datetime.utcnow()
        task.title = "Updated Timestamp Test"
        session.add(task)
        session.commit()
        after_update = datetime.utcnow()

        session.refresh(task)

        # The updated_at should be after the update time
        assert task.updated_at >= before_update
        assert task.updated_at <= after_update