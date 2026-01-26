from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
from authentication.auth_router import auth_router
from recipes.recipes_router import recipes_router
from rich import print

# load environment variable from .env file
load_dotenv()

RENDER = os.getenv("RENDER")

app = FastAPI(redirect_slashes=False)

# TODO, add production-ready origins,
# Get CORS origins from environment variable
cors_origins_str = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:4173",
)

origins = [origin.strip() for origin in cors_origins_str.split(",")]

print("Allowing the following Origins: ", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "your-secret-key-here"),
    session_cookie=os.getenv("SESSION_COOKIE_NAME", "session"),
    max_age=int(
        os.getenv("SESSION_MAX_AGE", "7200")
    ),  # Default 2 hours in seconds
    same_site=(
        "none" if RENDER is not None else "lax"
    ),  # Changed from 'none' to 'lax' for localhost
    # Changes the cookie to secure if we are running on render.com
    https_only=True if RENDER is not None else False,
)

app.include_router(auth_router)
app.include_router(recipes_router)
