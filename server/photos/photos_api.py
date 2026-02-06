"""Image Upload Routines"""

from __future__ import annotations

# for unique filename for every image file
import uuid
from typing import TYPE_CHECKING

# Boto 3 is the library that you can use to talk to S3 compatible APIs
import boto3
from botocore.exceptions import ClientError

from shared.database import (
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    S3_ENDPOINT_URL,
    BUCKET_NAME,
    REGION_NAME,
)

if TYPE_CHECKING:
    from fastapi import UploadFile

# Create the boto3 client
s3 = boto3.client(
    "s3",
    endpoint_url=S3_ENDPOINT_URL,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=REGION_NAME,
)

# Constants for validation
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB max size
ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
]


def validate_image(image: UploadFile) -> bool:
    """
    Validate the image file before uploading.

    Returns:
    bool: True if valid, False otherwise
    """

    # Check file type (content_type)
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        error_message = (
            f"Unsupported file type: {image.content_type}. "
            f"Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )
        print(f"Image validation failed: {error_message}")
        return False

    # Check file size
    # First store current position
    current_position = image.file.tell()

    # move to end to get size
    image.file.seek(0, 2)
    size = image.file.tell()

    # Return to original position
    image.file.seek(current_position)

    if size > MAX_IMAGE_SIZE_BYTES:
        max_mb = MAX_IMAGE_SIZE_BYTES / (1024 * 1024)
        error_msg = f"File too large: {size} bytes. Max size: {max_mb} MB"
        print(f"Image validation failed: {error_msg}")
        return False

    return True


# AWS S3 gives pre-signed URLs to items in the bucket. These expire
# so you always need to go get new ones
def get_url(photo_name: str) -> str | None:
    """Return the full URL to a photo."""
    try:
        return s3.generate_presigned_url(
            "get_object",
            ExpiresIn=604800,
            Params={"Bucket": BUCKET_NAME, "Key": photo_name},
        )
    except ClientError as e:
        print(e)
        return None


def upload_photo(image: UploadFile) -> str | None:
    """Upload an image to an S3 bucket and return the filename."""
    # Validate the image before proceeding
    if not validate_image(image):
        return None

    # Create a unique filename, based on the filename we get
    # Plus a uuid
    # Keeps users from overwriting each other's files
    photo_name = f"{uuid.uuid4()}_{image.filename}"
    try:
        s3.upload_fileobj(
            image.file,
            BUCKET_NAME,
            photo_name,
            ExtraArgs={
                "ContentType": image.content_type,
            },
        )
    except ClientError as e:
        print(e)
        return None
    return photo_name
