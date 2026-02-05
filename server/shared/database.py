import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from dotenv import load_dotenv

# Load environment variable from .env file
# load environment variable from .env file
success = load_dotenv()
if not success:
    print("Warning: .env file not found or couldn't be loaded.")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/chefgpt",
)

# TODO make your own .env file, otherwise use these s3 configuration with default values
AWS_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY", "minioadmin")
AWS_SECRET_KEY = os.environ.get("AWS_SECRET_KEY", "minioadmin")
S3_PUBLIC_URL = os.environ.get("S3_PUBLIC_URL", "http://localhost:9000")
S3_ENDPOINT_URL = os.environ.get("S3_ENDPOINT_URL", "http://localhost:9000")
BUCKET_NAME = os.environ.get("BUCKET_NAME", "recipes-photos")
REGION_NAME = os.environ.get("REGION_NAME", "auto")


engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session() -> Generator[Session, None, None]:
    """Dependency to get database session."""
    with SessionLocal() as session:
        yield session
