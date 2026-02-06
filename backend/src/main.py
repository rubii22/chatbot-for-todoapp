"""
Main entry point for the Todo AI Chatbot Backend
"""
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.chat import router as chat_router
from .routes.auth import router as auth_router
from .routes.tasks import router as tasks_router
from .db import create_db_and_tables
import asyncio

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Todo AI Chatbot Backend")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup"""
    print("Todo AI Chatbot Backend starting up...")
    create_db_and_tables()  # Create database tables on startup

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

# Include the routes
app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(tasks_router)

# Run the MCP server as a subprocess if called directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)