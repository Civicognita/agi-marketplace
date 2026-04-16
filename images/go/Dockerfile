# Aionima Go Runtime Image
# Alpine base with CGO support for database drivers.
# Build: podman build --build-arg GO_VERSION=1.24 -t ghcr.io/civicognita/go:1.24 .

ARG GO_VERSION=1.24
FROM golang:${GO_VERSION}-alpine

# Build tools for CGO (needed by sqlite3, some database drivers)
RUN apk add --no-cache \
    git \
    gcc \
    musl-dev \
    ca-certificates \
    curl

WORKDIR /app

EXPOSE 8080
