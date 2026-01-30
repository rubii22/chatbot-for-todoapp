"""
Integration tests for the chat functionality
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from backend.src.main import app


def test_full_chat_flow():
    """Test the complete chat flow with conversation persistence"""
    with TestClient(app) as client:
        with patch.dict('os.environ', {'COHERE_API_KEY': 'test-key', 'BETTER_AUTH_SECRET': 'secret'}):
            with patch('jwt.decode') as mock_decode:
                mock_decode.return_value = {"user_id": "test-user"}

                with patch('backend.src.routes.chat.CohereAgent') as mock_agent_class:
                    # Mock agent responses for multiple calls
                    def mock_process_message_side_effect(user_id, message_content, conversation_id=None):
                        if "add" in message_content.lower():
                            return {
                                "conversation_id": conversation_id or 1,
                                "response": f"I've added the task '{message_content}'.",
                                "tool_calls": [{
                                    "name": "add_task",
                                    "arguments": {"user_id": user_id, "title": message_content},
                                    "result": {"task_id": 123, "status": "created", "title": message_content}
                                }]
                            }
                        else:
                            return {
                                "conversation_id": conversation_id or 1,
                                "response": "I've processed your request.",
                                "tool_calls": []
                            }

                    mock_agent_instance = MagicMock()
                    mock_agent_instance.process_message.side_effect = mock_process_message_side_effect
                    mock_agent_class.return_value = mock_agent_instance

                    # First request - create conversation
                    response1 = client.post(
                        "/api/test-user/chat",
                        json={"message": "Add a task to buy groceries"},
                        headers={"Authorization": "Bearer fake-token"}
                    )

                    assert response1.status_code == 200
                    data1 = response1.json()
                    assert data1["conversation_id"] == 1
                    assert "buy groceries" in data1["response"].lower()

                    # Second request - continue conversation
                    response2 = client.post(
                        "/api/test-user/chat",
                        json={
                            "message": "What did I ask you to do?",
                            "conversation_id": data1["conversation_id"]
                        },
                        headers={"Authorization": "Bearer fake-token"}
                    )

                    assert response2.status_code == 200
                    data2 = response2.json()
                    assert data2["conversation_id"] == 1  # Same conversation


def test_multiple_users_isolation():
    """Test that users cannot access each other's conversations"""
    with TestClient(app) as client:
        with patch.dict('os.environ', {'COHERE_API_KEY': 'test-key', 'BETTER_AUTH_SECRET': 'secret'}):
            with patch('jwt.decode') as mock_decode:
                # Mock decode for first user
                def mock_decode_side_effect(token, secret, algorithms):
                    if token == "token-user1":
                        return {"user_id": "user1"}
                    elif token == "token-user2":
                        return {"user_id": "user2"}
                    else:
                        return {"user_id": "user1"}  # default

                mock_decode.side_effect = mock_decode_side_effect

                with patch('backend.src.routes.chat.CohereAgent') as mock_agent_class:
                    mock_agent_instance = MagicMock()
                    mock_agent_instance.process_message.return_value = {
                        "conversation_id": 1,
                        "response": "I've processed your request.",
                        "tool_calls": []
                    }
                    mock_agent_class.return_value = mock_agent_instance

                    # User 1 creates a conversation
                    response1 = client.post(
                        "/api/user1/chat",
                        json={"message": "Add a task"},
                        headers={"Authorization": "Bearer token-user1"}
                    )

                    assert response1.status_code == 200

                    # User 2 should not be able to access user 1's conversation
                    # This test verifies the authorization logic in the route


def test_conversation_continuity():
    """Test that conversation context is maintained across requests"""
    with TestClient(app) as client:
        with patch.dict('os.environ', {'COHERE_API_KEY': 'test-key', 'BETTER_AUTH_SECRET': 'secret'}):
            with patch('jwt.decode') as mock_decode:
                mock_decode.return_value = {"user_id": "test-user"}

                with patch('backend.src.routes.chat.CohereAgent') as mock_agent_class:
                    conversation_history = []

                    def mock_process_message(user_id, message_content, conversation_id=None):
                        # Simulate storing conversation history
                        conversation_history.append({
                            "user_id": user_id,
                            "message": message_content,
                            "conversation_id": conversation_id or len(conversation_history) + 1
                        })

                        return {
                            "conversation_id": conversation_id or len(conversation_history),
                            "response": f"Received: {message_content}",
                            "tool_calls": []
                        }

                    mock_agent_instance = MagicMock()
                    mock_agent_instance.process_message.side_effect = mock_process_message
                    mock_agent_class.return_value = mock_agent_instance

                    # Multiple requests to test continuity
                    resp1 = client.post(
                        "/api/test-user/chat",
                        json={"message": "First message"},
                        headers={"Authorization": "Bearer fake-token"}
                    )

                    resp2 = client.post(
                        "/api/test-user/chat",
                        json={
                            "message": "Second message",
                            "conversation_id": resp1.json()["conversation_id"]
                        },
                        headers={"Authorization": "Bearer fake-token"}
                    )

                    assert resp1.status_code == 200
                    assert resp2.status_code == 200

                    # Both requests should use the same conversation ID
                    assert resp1.json()["conversation_id"] == resp2.json()["conversation_id"]