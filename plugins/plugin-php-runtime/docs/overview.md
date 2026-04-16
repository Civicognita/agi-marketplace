# PHP Runtime

## Overview

Provides managed PHP + Apache container runtimes for Aionima-hosted projects. Ships every common extension pre-compiled so frameworks like Laravel and WordPress work out of the box.

## Available Versions

| Version | Image | Status |
|---------|-------|--------|
| 8.5 | `ghcr.io/civicognita/php-apache:8.5` | Latest |
| 8.4 | `ghcr.io/civicognita/php-apache:8.4` | Stable |
| 8.3 | `ghcr.io/civicognita/php-apache:8.3` | Previous |

## Pre-installed Tools

- **Extensions:** `gd`, `intl`, `pdo_pgsql`, `pdo_mysql`, `redis`, `imagick`, `zip`, `bcmath`, `opcache`, `pcntl`, `sockets`, `exif`, `sodium`
- **Composer** — dependency manager, available globally as `composer`
- **mod_rewrite** — enabled in Apache for clean URL routing

## Usage

1. Open **Settings > PHP** to set the default version for new projects.
2. Per-project override: open the project's hosting panel and select a version from the Runtime dropdown.
3. Port `80` is exposed. Apache serves from `/var/www/html` by default.

## Container Image

```
ghcr.io/civicognita/php-apache:{version}
```

Based on the official `php:{version}-apache` image. Adds all extensions listed above, enables mod_rewrite, and installs Composer so no additional build steps are needed for standard PHP frameworks.
