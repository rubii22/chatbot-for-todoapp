from sqlmodel import create_engine, Session
from .models.models import *
import os
from typing import Generator, Tuple, List, Optional
from sqlmodel import select

# Get database URL from environment, default to a local SQLite for testing
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_chatbot.db")

# Create the database engine
engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Get database session"""
    with Session(engine) as session:
        yield session


async def get_user_by_email(email: str) -> Optional[User]:
    """Get user by email"""
    with Session(engine) as session:
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        return user


async def create_user(name: str, email: str, password_hash: str) -> int:
    """Create a new user"""
    with Session(engine) as session:
        user = User(name=name, email=email, password_hash=password_hash)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user.id


async def get_user_by_id(user_id: int) -> Optional[User]:
    """Get user by ID"""
    with Session(engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()
        return user


def get_conversation_history(user_id: str, conversation_id: Optional[int] = None) -> Tuple[Conversation, List[Message]]:
    """
    Retrieve conversation and its messages from database

    Args:
        user_id: The ID of the user
        conversation_id: Optional conversation ID, if None creates new conversation

    Returns:
        Tuple of (Conversation object, List of Message objects)
    """
    with Session(engine) as session:
        if conversation_id:
            # Get existing conversation
            conversation = session.get(Conversation, conversation_id)
            if not conversation or conversation.user_id != user_id:
                raise ValueError("Conversation not found or does not belong to user")
        else:
            # Create new conversation
            conversation = Conversation(user_id=user_id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)

        # Get all messages for this conversation
        statement = select(Message).where(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at)

        messages = session.exec(statement).all()

        return conversation, list(messages)


def save_message(conversation_id: int, role: MessageRole, content: str) -> Message:
    """
    Save a message to the database

    Args:
        conversation_id: The ID of the conversation
        role: The role of the message (user or assistant)
        content: The content of the message

    Returns:
        The saved Message object
    """
    with Session(engine) as session:
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content
        )
        session.add(message)
        session.commit()
        session.refresh(message)

        return message