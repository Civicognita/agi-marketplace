# Aionima MariaDB Service Image
# Dev-friendly configuration defaults.
# Build: podman build --build-arg MARIADB_VERSION=11.4 -t ghcr.io/civicognita/mariadb:11.4 .

ARG MARIADB_VERSION=11.4
FROM mariadb:${MARIADB_VERSION}

# Dev-friendly configuration — higher limits for local development
RUN echo "[mysqld]\n\
max_connections = 100\n\
innodb_buffer_pool_size = 256M\n\
innodb_log_file_size = 64M\n\
character-set-server = utf8mb4\n\
collation-server = utf8mb4_unicode_ci\n\
# Allow larger imports\n\
max_allowed_packet = 64M\n\
" > /etc/mysql/conf.d/aionima.cnf
