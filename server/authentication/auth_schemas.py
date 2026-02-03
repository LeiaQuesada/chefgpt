from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class SignUpRequest(BaseModel):
    username: str
    password: str
    image_url: str | None = None


class LoginResponse(BaseModel):
    success: bool


class UserPublicDetailsResponse(BaseModel):
    id: int
    username: str
    image_url: str | None = None


class AuthenticatedUser(BaseModel):
    username: str
    user_id: int


class UpdateUserRequest(BaseModel):
    username: str
    password: str | None = None
