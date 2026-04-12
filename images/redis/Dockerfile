# Aionima Redis Service Image
# Vanilla Alpine Redis with dev-friendly defaults.
# Build: podman build --build-arg REDIS_VERSION=7.4 -t ghcr.io/civicognita/redis:7.4 .

ARG REDIS_VERSION=7.4
FROM redis:${REDIS_VERSION}-alpine

# Dev-friendly config: higher memory limit, append-only for durability
RUN mkdir -p /usr/local/etc/redis && \
    printf 'maxmemory 256mb\nmaxmemory-policy allkeys-lru\nappendonly yes\n' \
    > /usr/local/etc/redis/aionima.conf

CMD ["redis-server", "/usr/local/etc/redis/aionima.conf"]
