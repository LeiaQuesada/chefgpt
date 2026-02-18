# ChefGPT Backend 🍳⚙️

The ChefGPT backend is a FastAPI-powered REST API that handles authentication, AI integration (Gemini), recipe persistence, and object storage coordination using PostgreSQL and MinIO.

## Responsibilities

- RESTful API endpoints

- User authentication & authorization

- AI prompt construction & response parsing

- PostgreSQL data persistence

- Image upload & retrieval via MinIO

- usiness logic validation

## Tech Stack

- FastAPI

- Python

- PostgreSQL

- Docker

- MinIO (S3-compatible storage)

- Gemini API

## Local Setup

### Prerequisites

- Python 3.10+

- Docker

- Gemini API Key

### Create Virtual Environment

```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Start PostgreSQL (Docker)

```
docker compose up -d
```

Enter database:

```
docker compose exec postgres psql -U postgres chefgpt
```

Seed database:

```
\i data/chefgpt.sql
```

Exit:

```
exit
```

### Start API Server

```
fastapi dev
```

## Access Swagger Docs:

👉 http://localhost:8000/docs

## Database

ChefGPT uses a relational PostgreSQL schema that includes:

- Users

- Recipes

- Relationships between users and saved recipes

The schema is initialized via:

`data/chefgpt.sql`

## Gemini Integration

Accepts structured ingredient input

- Constructs AI prompt

- Parses and formats AI response

- Returns structured recipe object to client

## Environment variable required:

GEMINI_API_KEY=your_key_here

## MinIO Object Storage

MinIO runs locally for S3-compatible image storage.

Access console:

👉 http://localhost:9001

Username: minioadmin \
Password: minioadmin

## Development Tips

- Use /docs to test endpoints

- Monitor server logs for validation errors

- Use psql to inspect database tables

- Watch Docker container logs if DB issues arise
