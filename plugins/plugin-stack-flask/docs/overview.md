# Flask

Lightweight Python web framework with a minimal core and an ecosystem of extensions for databases, authentication, and templating. Runs in `ghcr.io/civicognita/python:3.12`.

## What It Provides

- Flask framework in a Python 3.12 container
- Development mode: `flask run --debug` with live reload
- Production mode: Gunicorn WSGI server (falls back to Flask dev server)
- Minimal structure — bring your own libraries

## Dependencies

Requires a **Python Runtime** stack.

## Getting Started

```bash
pip install -r requirements.txt
flask run --debug    # Dev server on :8000
```

Flask looks for `app.py` or uses the `FLASK_APP` environment variable. The container sets `FLASK_APP=app.py` by default.

## Minimal App

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, world!"
```

## When to Use Flask vs FastAPI vs Django

- **Flask** — Maximum flexibility, minimal opinions. Good when you want to choose your own ORM, auth, and structure.
- **FastAPI** — Modern async APIs with automatic docs and Pydantic validation.
- **Django** — Full-stack apps that benefit from built-in ORM, admin, and auth.

## Agent Notes

- Flask does not include an ORM — add SQLAlchemy or similar via `requirements.txt`
- Blueprints (`Blueprint`) are the standard way to split routes across files
- Flask extensions follow a `flask-*` naming convention on PyPI

## Available Tools

pip install, flask run, pytest.
