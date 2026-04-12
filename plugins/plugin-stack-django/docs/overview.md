# Django

Python web framework with batteries included — ORM, admin panel, authentication, and a template engine. Runs in `ghcr.io/civicognita/python:3.12`.

## What It Provides

- Django framework in a Python 3.12 container
- Development mode: `python manage.py runserver`
- Production mode: Gunicorn WSGI server (falls back to runserver)
- `manage.py` toolset for migrations, seeding, testing, and shell access

## Dependencies

Requires a **Python Runtime** stack.

## Getting Started

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver       # Dev server on :8000
```

## Key Directories and Files

- `manage.py` — Django CLI entry point
- `{project}/settings.py` — Application configuration
- `{project}/urls.py` — URL routing
- `{app}/models.py` — Database models (define ORM schema here)
- `{app}/views.py` — View functions or class-based views
- `templates/` — HTML templates (Jinja2-compatible)

## Admin Panel

Create a superuser to access the built-in admin at `/admin/`:

```bash
python manage.py createsuperuser
```

## Available Tools

| Tool | Command |
|------|---------|
| pip install | `pip install -r requirements.txt` |
| migrate | `python manage.py migrate` |
| makemigrations | `python manage.py makemigrations` |
| shell | `python manage.py shell` |
| test | `python manage.py test` |
| createsuperuser | `python manage.py createsuperuser` |
