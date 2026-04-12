# Aionima PostgreSQL Service Image
# Pre-installed extensions: pgvector, PostGIS, pg_trgm (core), uuid-ossp (core).
# Build: podman build --build-arg PG_VERSION=17 -t ghcr.io/civicognita/postgres:17 .

ARG PG_VERSION=17
FROM postgres:${PG_VERSION}-alpine

# Install build dependencies for pgvector and PostGIS runtime packages
# Determine the clang version available in Alpine for this PG release
RUN apk add --no-cache --virtual .build-deps \
      git \
      build-base \
      clang-dev \
      llvm-dev \
      postgresql-dev \
  # PostGIS — available as Alpine package for PG major versions
  && apk add --no-cache \
      postgis \
      proj \
      gdal \
      geos \
  # pgvector — compile from source (use gcc, not clang, to avoid version mismatch)
  && cd /tmp \
  && git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git \
  && cd pgvector \
  && make CC=gcc OPTFLAGS="" PG_CONFIG=/usr/local/bin/pg_config \
  && make install PG_CONFIG=/usr/local/bin/pg_config \
  && cd / \
  && rm -rf /tmp/pgvector \
  # Cleanup build deps
  && apk del .build-deps

# Pre-load shared libraries so CREATE EXTENSION works immediately
RUN echo "shared_preload_libraries = 'vector'" >> /usr/local/share/postgresql/postgresql.conf.sample
