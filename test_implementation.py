#!/usr/bin/env python3
"""
Test script to validate the MCP Tools and Database Models implementation
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_imports():
    """Test that all modules can be imported successfully"""
    print("Testing imports...")

    try:
        from backend.src.models.models import Task, Conversation, Message, TaskStatus, MessageRole
        print("[OK] Models imported successfully")
    except ImportError as e:
        print(f"[ERROR] Failed to import models: {e}")
        return False

    try:
        from backend.src.db import create_db_and_tables, get_session, engine
        print("[OK] Database module imported successfully")
    except ImportError as e:
        print(f"[ERROR] Failed to import database module: {e}")
        return False

    try:
        from backend.src.mcp.tools import add_task, list_tasks, complete_task, delete_task, update_task
        print("[OK] MCP tools imported successfully")
    except ImportError as e:
        print(f"[ERROR] Failed to import MCP tools: {e}")
        return False

    try:
        from backend.src.mcp.server import call_tool, get_registered_tools
        print("[OK] MCP server imported successfully")
    except ImportError as e:
        print(f"[ERROR] Failed to import MCP server: {e}")
        return False

    try:
        from backend.src.utils.auth_utils import validate_user_id, authenticate_user
        print("[OK] Utilities imported successfully")
    except ImportError as e:
        print(f"[ERROR] Failed to import utilities: {e}")
        return False

    return True


def test_basic_functionality():
    """Test basic functionality of the tools"""
    print("\nTesting basic functionality...")

    # Import required modules
    from backend.src.mcp.tools import add_task, list_tasks, complete_task, delete_task, update_task
    from backend.src.models.models import SQLModel
    from backend.src.db import engine

    # Reset database for clean test
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

    # Test add_task
    result = add_task(user_id="test_user", title="Test Task", description="Test Description")
    if "task_id" not in result or result["status"] != "created":
        print(f"[ERROR] add_task failed: {result}")
        return False
    print("[OK] add_task works correctly")

    task_id = result["task_id"]

    # Test list_tasks
    tasks = list_tasks(user_id="test_user")
    if len(tasks) != 1 or tasks[0]["title"] != "Test Task":
        print(f"[ERROR] list_tasks failed: {tasks}")
        return False
    print("[OK] list_tasks works correctly")

    # Test update_task
    result = update_task(user_id="test_user", task_id=task_id, title="Updated Task")
    if result.get("status") != "updated" or result.get("title") != "Updated Task":
        print(f"[ERROR] update_task failed: {result}")
        return False
    print("[OK] update_task works correctly")

    # Test complete_task
    result = complete_task(user_id="test_user", task_id=task_id)
    if result.get("status") != "completed":
        print(f"[ERROR] complete_task failed: {result}")
        return False
    print("[OK] complete_task works correctly")

    # Test delete_task
    result = delete_task(user_id="test_user", task_id=task_id)
    if result.get("status") != "deleted":
        print(f"[ERROR] delete_task failed: {result}")
        return False
    print("[OK] delete_task works correctly")

    # Verify task was deleted
    tasks = list_tasks(user_id="test_user")
    if len(tasks) != 0:
        print(f"[ERROR] Task was not properly deleted: {tasks}")
        return False
    print("[OK] Task deletion confirmed")

    return True


def test_user_isolation():
    """Test that users can only access their own tasks"""
    print("\nTesting user isolation...")

    from backend.src.mcp.tools import add_task, list_tasks
    from backend.src.models.models import SQLModel
    from backend.src.db import engine

    # Reset database for clean test
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

    # Add tasks for different users
    user1_task = add_task(user_id="user1", title="User 1 Task")
    user2_task = add_task(user_id="user2", title="User 2 Task")

    if "task_id" not in user1_task or "task_id" not in user2_task:
        print("✗ Failed to add tasks for different users")
        return False

    # Check user isolation
    user1_tasks = list_tasks(user_id="user1")
    user2_tasks = list_tasks(user_id="user2")

    if len(user1_tasks) != 1 or user1_tasks[0]["title"] != "User 1 Task":
        print(f"[ERROR] User 1 tasks incorrect: {user1_tasks}")
        return False

    if len(user2_tasks) != 1 or user2_tasks[0]["title"] != "User 2 Task":
        print(f"[ERROR] User 2 tasks incorrect: {user2_tasks}")
        return False

    print("[OK] User isolation works correctly")
    return True


def main():
    """Run all tests"""
    print("Starting implementation validation...\n")

    if not test_imports():
        print("\n[ERROR] Import tests failed!")
        return False

    if not test_basic_functionality():
        print("\n[ERROR] Basic functionality tests failed!")
        return False

    if not test_user_isolation():
        print("\n[ERROR] User isolation tests failed!")
        return False

    print("\n[SUCCESS] All tests passed! Implementation is working correctly.")
    return True


if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)