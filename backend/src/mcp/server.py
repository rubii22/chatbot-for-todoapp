"""
MCP Server for the Todo AI Chatbot
Sets up the MCP tools for the AI agent to use
"""
try:
    from mcp import FastMCP
    from .tools import add_task, list_tasks, complete_task, delete_task, update_task

    # Create the server instance
    mcp_server = FastMCP("todo-chatbot-mcp-server")

    # Explicitly register all tools to ensure they're available
    mcp_server.register_tool(add_task)
    mcp_server.register_tool(list_tasks)
    mcp_server.register_tool(complete_task)
    mcp_server.register_tool(delete_task)
    mcp_server.register_tool(update_task)

    def call_tool(tool_name: str, **kwargs):
        """Public function to call an MCP tool using real SDK method"""
        return mcp_server.call_tool(tool_name, **kwargs)

    def get_registered_tools():
        """Return a list of registered tools with their metadata using SDK method"""
        return mcp_server.list_tools()  # Assuming the SDK has a method to list tools

except ImportError:
    # Fallback implementation when the real MCP SDK is not available
    from .tools import add_task as _add_task
    from .tools import list_tasks as _list_tasks
    from .tools import complete_task as _complete_task
    from .tools import delete_task as _delete_task
    from .tools import update_task as _update_task

    # Store the tools in a registry
    TOOLS_REGISTRY = {
        "add_task": _add_task,
        "list_tasks": _list_tasks,
        "complete_task": _complete_task,
        "delete_task": _delete_task,
        "update_task": _update_task
    }

    def call_tool(tool_name: str, **kwargs):
        """Public function to call an MCP tool using fallback method"""
        if tool_name in TOOLS_REGISTRY:
            tool_func = TOOLS_REGISTRY[tool_name]
            return tool_func(**kwargs)
        else:
            return {"error": {"code": "TOOL_NOT_FOUND", "message": f"Tool {tool_name} not found"}}

    def get_registered_tools():
        """Return a list of registered tools with their metadata using fallback method"""
        return {
            "server_name": "todo-chatbot-mcp-server",
            "tools": [
                {"name": name, "description": getattr(func, '__doc__', f'Tool {name}')}
                for name, func in TOOLS_REGISTRY.items()
            ]
        }