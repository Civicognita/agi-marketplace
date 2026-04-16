# Aionima Python Runtime Image
# Slim base with common build dependencies for Python packages.
# Build: podman build --build-arg PYTHON_VERSION=3.12 -t ghcr.io/civicognita/python:3.12 .

ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim

# Build dependencies for common Python packages (psycopg2, Pillow, cryptography, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libwebp-dev \
    libffi-dev \
    libssl-dev \
    git \
    curl \
  && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

WORKDIR /app

EXPOSE 8000
