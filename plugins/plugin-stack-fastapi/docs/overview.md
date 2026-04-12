# FastAPI

High-performance async Python API framework with automatic OpenAPI documentation, Pydantic request/response validation, and dependency injection. Runs in `ghcr.io/civicognita/python:3.12`.

## What It Provides

- FastAPI framework in a Python 3.12 container
- Development mode: `uvicorn main:app --reload` with live reload
- Production mode: `uvicorn main:app --workers 2`
- Auto-generated API docs at `/docs` (Swagger UI) and `/redoc` (ReDoc)

## Dependencies

Requires a **Python Runtime** stack.

## Getting Started

```bash
pip install -r requirements.txt
uvicorn main:app --reload    # Dev server on :8000
```

API documentation is automatically available at `http://localhost:8000/docs` once the server starts.

## Project Structure

The entry point is `main.py` by default. FastAPI looks for an `app` object:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello"}
```

## Agent Notes

- All route parameters and request bodies are validated by Pydantic automatically
- Use `async def` for route handlers to take full advantage of async I/O
- Dependency injection via `Depends()` — use it for database sessions, auth checks, shared config
- Request models: define Pydantic `BaseModel` subclasses and use them as type hints on route parameters
- The `/docs` endpoint is active in all modes and is useful for manual testing

## Available Tools

pip install, uvicorn dev (with reload), pytest.
