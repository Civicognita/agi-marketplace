# Rust App

Rust application hosting with Cargo. Builds an optimized release binary for production and runs with `cargo run` in development. Runs in `ghcr.io/civicognita/rust:1.87`.

## What It Provides

- Rust 1.87 container
- Development mode: `cargo run`
- Production mode: `cargo build --release` then runs the release binary
- Cargo toolchain: build, test, clippy

## Dependencies

Requires a **Rust Runtime** stack.

## Getting Started

```bash
cargo build              # Compile debug build
cargo run                # Run on :8080
cargo test               # Run tests
cargo build --release    # Optimized production binary
cargo clippy             # Lint
```

The container exposes port 8080 by default. Read `PORT` from the environment in your application if you want to support configuration.

## Environment

The container sets:
- `PORT=8080`
- `RUST_LOG=info`

Use the `log` crate with `env_logger` or `tracing` with `tracing-subscriber` to consume `RUST_LOG`.

## Agent Notes

- `Cargo.toml` defines the package name — the release binary has the same name as the `[package] name` field
- Compile times are significant; the container caches the build directory between restarts
- For web servers, common crates: `axum`, `actix-web`, `warp`, `hyper`
- For async runtime: `tokio` is the standard choice

## Available Tools

cargo run, cargo build, cargo build --release, cargo test, cargo clippy.
