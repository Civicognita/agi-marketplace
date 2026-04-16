# Aionima PHP-Apache Runtime Image
# Kitchen-sink PHP with all common extensions pre-installed.
# Build: podman build --build-arg PHP_VERSION=8.4 -t ghcr.io/civicognita/php-apache:8.4 .

ARG PHP_VERSION=8.4
FROM php:${PHP_VERSION}-apache

# System dependencies for PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    # GD dependencies
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libwebp-dev \
    # Imagick
    libmagickwand-dev \
    # Intl
    libicu-dev \
    # Zip
    libzip-dev \
    # PostgreSQL
    libpq-dev \
    # Sodium (usually bundled, but ensure headers exist)
    libsodium-dev \
    # General tools
    git \
    unzip \
    curl \
  && rm -rf /var/lib/apt/lists/*

# Core PHP extensions via docker-php-ext-install
RUN docker-php-ext-configure gd \
      --with-freetype \
      --with-jpeg \
      --with-webp \
  && docker-php-ext-install -j$(nproc) \
      bcmath \
      exif \
      gd \
      intl \
      mysqli \
      opcache \
      pcntl \
      pdo_mysql \
      pdo_pgsql \
      pgsql \
      sockets \
      zip \
  # sodium is built-in since PHP 8.2 — enable it if not already loaded
  && php -m | grep -qi sodium || docker-php-ext-enable sodium 2>/dev/null || true

# PECL extensions
RUN pecl install redis imagick \
  && docker-php-ext-enable redis imagick

# Apache: enable mod_rewrite (required by Laravel, WordPress, etc.)
RUN a2enmod rewrite headers

# Composer (latest stable)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Production-ready PHP config
COPY php.ini /usr/local/etc/php/conf.d/aionima.ini

# Default document root stays /var/www/html — stacks override via volume mounts
WORKDIR /var/www/html
