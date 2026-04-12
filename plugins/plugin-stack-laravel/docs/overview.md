# Laravel

Laravel PHP framework stack. Provides full Laravel application hosting using `ghcr.io/civicognita/php-apache:8.4` — a custom image with PHP extensions, Composer, and Apache mod_rewrite pre-installed.

## What It Provides

- PHP + Apache container configured for Laravel's `public/` document root
- Composer dependency management
- `php artisan` toolset (migrations, seeding, testing, caching)
- Log streaming from `storage/logs/laravel.log`
- Hot-reload in development via `php artisan serve`

## Initial Setup

Every fresh Laravel project needs these steps before it runs:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

The **Environment Variables** tab in Aionima can create `.env` from `.env.example` automatically if one exists.

## Database Configuration

Add a PostgreSQL or MariaDB stack to the project, then set these values in `.env`:

```
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=myapp
DB_USERNAME=myapp_user
DB_PASSWORD=your_password
```

The exact values are on the database stack card.

## Available Tools

| Tool | Command |
|------|---------|
| Migrate | `php artisan migrate` |
| Seed | `php artisan db:seed` |
| Test | `php artisan test` |
| Optimize | `php artisan optimize` |
| Clear Cache | `php artisan optimize:clear` |
| Full Reset | `php artisan migrate:fresh --seed` |
| key:generate | `php artisan key:generate` |
| route:list | `php artisan route:list` |

## Logs

Laravel application logs stream from `storage/logs/laravel.log` in the Logs panel.
Apache error and access logs are available in the container at `/var/log/apache2/`.
