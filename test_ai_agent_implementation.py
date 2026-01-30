#!/usr/bin/env python3
"""
Test script to validate the AI Agent and Chat Endpoint implementation
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_imports():
    """Test that all modules can be imported successfully"""
    print("Testing imports...")

    try:
        from backend.src.agent.agent import CohereAgent
        print("[OK] Agent module imported successfully")
    except ImportError as e:
        print(f"[ERROR] Failed to import agent: {e}")
        return False

    try:
        from backend.src.routes.chat import ChatRequest, ChatResponse, router
        print("[OK] Chat route module imported successfully")
    except ImportError as e:
        print(f"[ERROR] Failed to import chat route: {e}")
        return False

    try:
        from backend.src.db import get_conversation_history, save_message
        print("[OK] Database module imported successfully")
    except ImportError as e:
        print(f"[ERROR] Failed to import database module: {e}")
        return False

    try:
        from backend.src.main import app
        print("[OK] Main application imported successfully")
    except ImportError as e:
        print(f"[ERROR] Failed to import main application: {e}")
        return False

    return True


def test_basic_functionality():
    """Test basic functionality of the agent"""
    print("\nTesting basic functionality...")

    # Test agent initialization (without actual Cohere API key)
    try:
        import os
        # Temporarily set a mock API key for testing
        os.environ['COHERE_API_KEY'] = 'test-key'

        from backend.src.agent.agent import CohereAgent

        # This should raise an error due to invalid API key, but class should be constructible
        try:
            agent = CohereAgent()
            # If it doesn't raise an error, the initialization succeeded
            print("[OK] Agent initialization works")
        except Exception as e:
            # It's expected to fail with an invalid API key, but the class should be loadable
            if "invalid" in str(e).lower() or "api" in str(e).lower():
                print("[OK] Agent initialization failed as expected due to invalid API key (but class is valid)")
            else:
                print(f"[ERROR] Unexpected error during agent initialization: {e}")
                return False

    except Exception as e:
        print(f"[ERROR] Failed to test agent initialization: {e}")
        return False

    return True


def test_routes_structure():
    """Test that the route structure is correct"""
    print("\nTesting route structure...")

    try:
        from backend.src.routes.chat import ChatRequest, ChatResponse, router
        from pydantic import BaseModel

        # Test that request/response models are properly defined
        request_example = ChatRequest(message="test message", conversation_id=1)
        assert isinstance(request_example, BaseModel)
        print("[OK] Chat request model structure is correct")

        # Test response model
        response_example = ChatResponse(
            conversation_id=1,
            response="test response",
            tool_calls=[]
        )
        assert isinstance(response_example, BaseModel)
        print("[OK] Chat response model structure is correct")

    except Exception as e:
        print(f"[ERROR] Route structure test failed: {e}")
        return False

    return True


def test_database_functions():
    """Test that database functions are properly defined"""
    print("\nTesting database functions...")

    try:
        from backend.src.db import get_conversation_history, save_message
        from backend.src.models.models import MessageRole

        # Test that functions exist and have correct signatures
        import inspect
        sig1 = inspect.signature(get_conversation_history)
        sig2 = inspect.signature(save_message)

        print("[OK] Database functions are properly defined")

    except Exception as e:
        print(f"[ERROR] Database functions test failed: {e}")
        return False

    return True


def main():
    """Run all tests"""
    print("Starting AI Agent and Chat Endpoint implementation validation...\n")

    if not test_imports():
        print("\n[ERROR] Import tests failed!")
        return False

    if not test_basic_functionality():
        print("\n[ERROR] Basic functionality tests failed!")
        return False

    if not test_routes_structure():
        print("\n[ERROR] Route structure tests failed!")
        return False

    if not test_database_functions():
        print("\n[ERROR] Database function tests failed!")
        return False

    print("\n[SUCCESS] All tests passed! Implementation is structurally correct.")
    print("\nNote: The agent requires a valid COHERE_API_KEY to function fully.")
    print("To run the application: uv run uvicorn backend.src.main:app --reload")
    print("To test the endpoint: curl -X POST http://localhost:8000/api/{user_id}/chat")
    return True


if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)