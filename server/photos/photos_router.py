from fastapi import APIRouter, HTTPException, UploadFile
from .photos_db import (
    get_photos,
    add_photo,
)
from .photos_schemas import PhotoResponse
from .photos_api import upload_photo, get_url

photos_router = APIRouter(prefix="/api/photos", tags=["photos"])


# image upload
@photos_router.get("", response_model=list[PhotoResponse])
def get_photos_endpoint() -> list[PhotoResponse]:
    """Return all photos from the database."""
    return [
        PhotoResponse.model_validate(
            {"id": photo.id, "photo_url": get_url(str(photo.photo_name))}
        )
        for photo in get_photos()
    ]


@photos_router.post("", response_model=PhotoResponse)
def upload_photo_endpoint(photo: UploadFile) -> PhotoResponse:
    """Upload a photo and save it to the database."""
    photo_name = upload_photo(photo)
    if photo_name is None:
        raise HTTPException(status_code=400, detail="Photo upload failed")
    db_photo = add_photo(photo_name)
    return PhotoResponse.model_validate(
        {"id": db_photo.id, "photo_url": get_url(str(db_photo.photo_name))}
    )
