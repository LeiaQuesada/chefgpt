from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime
from typing import Optional, TYPE_CHECKING
from shared.base_model import Base

if TYPE_CHECKING:
    from recipes.recipes_models import DBRecipe


class DBUser(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(nullable=True)
    session_token: Mapped[str] = mapped_column(nullable=True)
    session_expires_at: Mapped[datetime] = mapped_column(nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=datetime.now
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=datetime.now, onupdate=datetime.now
    )

    # Relationhip to recipes through the junction table
    recipes: Mapped[list["DBRecipe"]] = relationship(back_populates="user")
