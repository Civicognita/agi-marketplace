# Aionima Rust Runtime Image
# Slim base with build tools for compilation.
# Build: podman build --build-arg RUST_VERSION=1.87 -t ghcr.io/civicognita/rust:1.87 .

ARG RUST_VERSION=1.87
FROM rust:${RUST_VERSION}-slim

# Build dependencies for common Rust crates (openssl, diesel, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    libssl-dev \
    libpq-dev \
    git \
    curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

EXPOSE 8080
