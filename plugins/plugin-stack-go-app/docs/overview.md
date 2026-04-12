# Go App

Go application hosting with fast compilation and a single binary output. Runs in `ghcr.io/civicognita/go:1.24`.

## What It Provides

- Go 1.24 container
- Development mode: `go run .`
- Production mode: `go build -o /tmp/server . && /tmp/server`
- Standard `go` toolchain (test, mod, vet)

## Dependencies

Requires a **Go Runtime** stack.

## Getting Started

```bash
go mod download       # Download dependencies
go run .              # Dev server on :8080
go build -o server .  # Build production binary
go test ./...         # Run tests
```

The container exposes port 8080 by default. Set the `PORT` environment variable if your application reads it.

## Minimal HTTP Server

```go
package main

import (
    "fmt"
    "net/http"
    "os"
)

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Hello")
    })
    http.ListenAndServe(":"+port, nil)
}
```

## Agent Notes

- `go.mod` and `go.sum` must be committed — `go mod tidy` removes unused dependencies
- `CGO_ENABLED=1` is set in the container, so CGo extensions (e.g. SQLite drivers) work
- For hot reload in development, consider adding `air` to the project

## Available Tools

go run, go build, go test, go mod tidy.
