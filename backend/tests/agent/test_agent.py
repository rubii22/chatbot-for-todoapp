"""
Unit tests for the Cohere agent
"""
import pytest
from unittest.mock import Mock, patch
from backend.src.agent.agent import CohereAgent
from backend.src.models.models import MessageRole


def test_cohere_agent_initialization():
    """Test that Cohere agent initializes with API key"""
    # Mock the environment variable
    with patch.dict('os.environ', {'COHERE_API_KEY': 'test-key'}):
        agent = CohereAgent()

        assert agent.client is not None
        assert len(agent.tools) == 5  # add_task, list_tasks, complete_task, delete_task, update_task


def test_process_message_basic():
    """Test basic message processing"""
    with patch.dict('os.environ', {'COHERE_API_KEY': 'test-key'}):
        agent = CohereAgent()

        # Mock the Cohere client response
        mock_response = Mock()
        mock_response.text = "I'll help you add that task."
        mock_response.tool_calls = []

        with patch.object(agent.client, 'chat', return_value=mock_response):
            with patch('backend.src.agent.agent.CohereAgent._get_conversation_history') as mock_get_conv:
                with patch('backend.src.agent.agent.CohereAgent._save_message'):
                    mock_conversation = Mock()
                    mock_conversation.id = 1
                    mock_get_conv.return_value = (mock_conversation, [])

                    result = agent.process_message(
                        user_id="test-user",
                        message_content="Add a task to buy groceries"
                    )

                    assert "response" in result
                    assert "conversation_id" in result
                    assert "tool_calls" in result


def test_process_message_with_tool_calls():
    """Test message processing with tool calls"""
    with patch.dict('os.environ', {'COHERE_API_KEY': 'test-key'}):
        agent = CohereAgent()

        # Mock the Cohere client response with tool calls
        mock_response = Mock()
        mock_response.text = "I've added the task for you."

        # Create mock tool call
        mock_tool_call = Mock()
        mock_tool_call.name = "add_task"
        mock_tool_call.parameters = {"title": "buy groceries", "description": "get milk and eggs"}

        mock_response.tool_calls = [mock_tool_call]

        with patch.object(agent.client, 'chat', return_value=mock_response):
            with patch('backend.src.agent.agent.call_tool') as mock_call_tool:
                mock_call_tool.return_value = {"task_id": 123, "status": "created", "title": "buy groceries"}

                with patch('backend.src.agent.agent.CohereAgent._get_conversation_history') as mock_get_conv:
                    with patch('backend.src.agent.agent.CohereAgent._save_message'):
                        mock_conversation = Mock()
                        mock_conversation.id = 1
                        mock_get_conv.return_value = (mock_conversation, [])

                        result = agent.process_message(
                            user_id="test-user",
                            message_content="Add a task to buy groceries"
                        )

                        # Verify tool was called
                        mock_call_tool.assert_called_once_with(
                            "add_task",
                            user_id="test-user",
                            title="buy groceries",
                            description="get milk and eggs"
                        )

                        assert len(result["tool_calls"]) == 1
                        assert result["tool_calls"][0]["name"] == "add_task"


def test_error_handling():
    """Test error handling in message processing"""
    with patch.dict('os.environ', {'COHERE_API_KEY': 'test-key'}):
        agent = CohereAgent()

        # Mock an exception in Cohere client
        with patch.object(agent.client, 'chat', side_effect=Exception("API Error")):
            with patch('backend.src.agent.agent.CohereAgent._get_conversation_history') as mock_get_conv:
                with patch('backend.src.agent.agent.CohereAgent._save_message'):
                    mock_conversation = Mock()
                    mock_conversation.id = 1
                    mock_get_conv.return_value = (mock_conversation, [])

                    result = agent.process_message(
                        user_id="test-user",
                        message_content="Add a task"
                    )

                    # Should still return a response with error message
                    assert "encountered an issue" in result["response"]
                    assert len(result["tool_calls"]) == 0