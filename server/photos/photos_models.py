"""SQLAlchemy Models."""

from sqlalchemy import Column, Integer, String
from shared.base_model import Base


class DBPhoto(Base):
    """Model representing a photo in the database."""

    __tablename__ = "photos"
    id = Column(Integer, primary_key=True, index=True)
    photo_name = Column(String, nullable=False)
