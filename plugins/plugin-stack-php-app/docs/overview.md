# PHP App

Generic PHP application hosting with Apache. Suitable for any PHP project that does not use a framework like Laravel. Runs in `ghcr.io/civicognita/php-apache:8.4` — a custom image with PHP extensions, Composer, and Apache mod_rewrite pre-installed.

## What It Provides

- PHP 8.4 + Apache container
- Development mode: built-in PHP development server (`php -S 0.0.0.0:80`)
- Production mode: Apache via `apache2-foreground`
- Composer for dependency management
- Apache error log streaming from `/var/log/apache2/error.log`

## Getting Started

Place your PHP files in the project root. For projects with dependencies:

```bash
composer install
```

In development mode, PHP serves files from `/var/www/html` on port 80. In production, Apache handles requests from the same directory.

## When to Use This Stack

Use PHP App for projects that don't use Laravel or another framework:

- Legacy PHP applications
- Simple PHP scripts or APIs
- WordPress (place files in the project root)
- Projects using smaller frameworks like Slim or Lumen

For Laravel projects, use the **Laravel** stack instead — it includes artisan tooling, proper document root configuration, and migration support.

## Available Tools

- **composer install** — Install PHP dependencies
- **composer update** — Update dependencies
- **composer dump-autoload** — Regenerate the autoloader
