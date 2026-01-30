"""
Unit tests for the chat endpoint
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from pydantic import BaseModel
from backend.src.main import app
from backend.src.agent.agent import CohereAgent


def test_chat_endpoint_basic():
    """Test basic chat endpoint functionality"""
    with TestClient(app) as client:
        # Mock the Cohere agent
        with patch.dict('os.environ', {'COHERE_API_KEY': 'test-key', 'BETTER_AUTH_SECRET': 'secret'}):
            # Mock JWT decoding
            with patch('jwt.decode') as mock_decode:
                mock_decode.return_value = {"user_id": "test-user"}

                # Mock the Cohere agent
                with patch('backend.src.routes.chat.CohereAgent') as mock_agent_class:
                    mock_agent_instance = MagicMock()
                    mock_agent_instance.process_message.return_value = {
                        "conversation_id": 1,
                        "response": "I'll help you with that.",
                        "tool_calls": []
                    }
                    mock_agent_class.return_value = mock_agent_instance

                    # Send a test request
                    response = client.post(
                        "/api/test-user/chat",
                        json={"message": "Add a task to buy groceries"},
                        headers={"Authorization": "Bearer fake-token"}
                    )

                    assert response.status_code == 200
                    data = response.json()
                    assert "response" in data
                    assert "conversation_id" in data
                    assert "tool_calls" in data


def test_chat_endpoint_with_conversation_id():
    """Test chat endpoint with existing conversation ID"""
    with TestClient(app) as client:
        with patch.dict('os.environ', {'COHERE_API_KEY': 'test-key', 'BETTER_AUTH_SECRET': 'secret'}):
            with patch('jwt.decode') as mock_decode:
                mock_decode.return_value = {"user_id": "test-user"}

                with patch('backend.src.routes.chat.CohereAgent') as mock_agent_class:
                    mock_agent_instance = MagicMock()
                    mock_agent_instance.process_message.return_value = {
                        "conversation_id": 123,
                        "response": "I've retrieved your tasks.",
                        "tool_calls": []
                    }
                    mock_agent_class.return_value = mock_agent_instance

                    response = client.post(
                        "/api/test-user/chat",
                        json={
                            "message": "Show my tasks",
                            "conversation_id": 123
                        },
                        headers={"Authorization": "Bearer fake-token"}
                    )

                    assert response.status_code == 200
                    data = response.json()
                    assert data["conversation_id"] == 123


def test_chat_endpoint_unauthorized():
    """Test chat endpoint without proper authorization"""
    with TestClient(app) as client:
        response = client.post(
            "/api/test-user/chat",
            json={"message": "Add a task"},
            # Missing authorization header
        )

        assert response.status_code == 401


def test_chat_endpoint_user_id_mismatch():
    """Test chat endpoint when path user_id doesn't match token user_id"""
    with TestClient(app) as client:
        with patch.dict('os.environ', {'COHERE_API_KEY': 'test-key', 'BETTER_AUTH_SECRET': 'secret'}):
            with patch('jwt.decode') as mock_decode:
                mock_decode.return_value = {"user_id": "different-user"}  # Different from path

                response = client.post(
                    "/api/test-user/chat",  # Path has 'test-user'
                    json={"message": "Add a task"},
                    headers={"Authorization": "Bearer fake-token"}
                )

                assert response.status_code == 403