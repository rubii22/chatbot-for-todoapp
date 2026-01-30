"""
Main entry point for the Todo AI Chatbot Backend
"""
from fastapi import FastAPI
from .routes.chat import router as chat_router
import asyncio

app = FastAPI(title="Todo AI Chatbot Backend")

@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup"""
    print("Todo AI Chatbot Backend starting up...")
    # Any initialization code would go here

@app.get("/")
async def root():
    """Root endpoint for health check"""
    return {"message": "Todo AI Chatbot Backend is running"}

@app.get("/tools")
async def list_tools():
    """Endpoint to list available MCP tools"""
    try:
        from .mcp.server import get_registered_tools
        return get_registered_tools()
    except ImportError:
        return {"error": "MCP tools not available"}

# Include the chat routes
app.include_router(chat_router)

# Run the MCP server as a subprocess if called directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)