"""Database routines."""

from collections.abc import Sequence
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from .photos_models import DBPhoto
from shared.base_model import Base

from shared.database import DATABASE_URL

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)

# Create all tables defined in the models
Base.metadata.create_all(engine)


def get_photos() -> Sequence[DBPhoto]:
    """Retrieve all photos from the database."""
    with SessionLocal() as session:
        stmt = select(DBPhoto)
        photos = session.scalars(stmt).all()
    return photos


def add_photo(photo_name: str) -> DBPhoto:
    """Add a single photo's name to the database."""
    with SessionLocal() as session:
        new_photo = DBPhoto(photo_name=photo_name)
        session.add(new_photo)
        session.commit()
        session.refresh(new_photo)
    return new_photo
