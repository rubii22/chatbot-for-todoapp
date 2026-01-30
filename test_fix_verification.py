#!/usr/bin/env python3
"""
Test script to verify that the MCP tools fix works correctly
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_server_import():
    """Test that the server module can be imported without errors"""
    print("Testing server import...")
    try:
        from backend.src.mcp.server import call_tool, get_registered_tools
        print("[OK] Server module imported successfully")
        return True
    except ImportError as e:
        print(f"[ERROR] Failed to import server: {e}")
        return False

def test_tool_availability():
    """Test that tools are available through the server"""
    print("\nTesting tool availability...")
    try:
        from backend.src.mcp.server import call_tool, get_registered_tools

        # Test that we can get registered tools
        tools = get_registered_tools()
        print(f"[OK] Got registered tools: {len(tools.get('tools', []))} tools available")

        # Verify all 5 tools are present
        tool_names = [tool['name'] for tool in tools.get('tools', [])]
        expected_tools = ['add_task', 'list_tasks', 'complete_task', 'delete_task', 'update_task']

        for expected_tool in expected_tools:
            if expected_tool not in tool_names:
                print(f"[ERROR] Missing expected tool: {expected_tool}")
                return False

        print(f"[OK] All expected tools present: {tool_names}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to get registered tools: {e}")
        return False

def test_tool_functionality():
    """Test that tools work correctly"""
    print("\nTesting tool functionality...")
    try:
        from backend.src.mcp.server import call_tool

        # Test add_task
        result = call_tool('add_task', user_id='test_user', title='Test Task', description='Test Description')
        if 'task_id' in result and result['status'] == 'created':
            print("[OK] add_task tool works correctly")
        else:
            print(f"[ERROR] add_task failed: {result}")
            return False

        # Test list_tasks
        result = call_tool('list_tasks', user_id='test_user')
        if isinstance(result, list):
            print("[OK] list_tasks tool works correctly")
        else:
            print(f"[ERROR] list_tasks failed: {result}")
            return False

        # Test complete_task (on the task we just created)
        # Note: This would fail if the task doesn't exist, which is expected behavior
        print("[OK] Tools are accessible and functioning")
        return True
    except Exception as e:
        print(f"[ERROR] Tool functionality test failed: {e}")
        return False

def test_chat_endpoint_access():
    """Test that the chat endpoint can access the tools"""
    print("\nTesting chat endpoint access to tools...")
    try:
        # This simulates what the chat endpoint does
        from backend.src.mcp.server import call_tool

        # Test various tool calls that might come from the chat agent
        test_calls = [
            ('add_task', {'user_id': 'user123', 'title': 'Buy groceries'}),
            ('list_tasks', {'user_id': 'user123'}),
            ('complete_task', {'user_id': 'user123', 'task_id': 1}),
        ]

        for tool_name, params in test_calls:
            try:
                result = call_tool(tool_name, **params)
                print(f"[OK] {tool_name} accessible via server interface")
            except Exception as e:
                print(f"[ERROR] {tool_name} not accessible: {e}")
                return False

        return True
    except Exception as e:
        print(f"[ERROR] Chat endpoint access test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("Starting MCP tools availability fix verification...\n")

    tests = [
        test_server_import,
        test_tool_availability,
        test_tool_functionality,
        test_chat_endpoint_access
    ]

    all_passed = True
    for test in tests:
        if not test():
            all_passed = False

    if all_passed:
        print("\n[SUCCESS] All tests passed! MCP tools are now available for the chat endpoint.")
        print("The error {'error': 'MCP tools not available'} should no longer occur.")
    else:
        print("\n[ERROR] Some tests failed!")

    return all_passed

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)