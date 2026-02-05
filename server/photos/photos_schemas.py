from shared.base_schema import BaseSchema


class PhotoResponse(BaseSchema):
    """Represents the response we send back for a single photo."""

    id: int
    photo_url: str | None = None
