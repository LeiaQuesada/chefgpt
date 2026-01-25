import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from dotenv import load_dotenv

# Load environment variable from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/chefgpt"
)

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_session() -> Generator[Session, None, None]:
    """Dependency to get database session."""
    with SessionLocal() as session:
        yield session
