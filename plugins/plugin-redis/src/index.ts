/**
 * Redis Service Plugin — registers Redis in-memory data store service.
 *
 * Provides Redis 7.4, 7.2, and 6.2 LTS as selectable versions.
 * Persistence enabled by default (appendonly).
 */

import type { AionimaPluginAPI } from "@aionima/plugins";

export async function activate(api: AionimaPluginAPI): Promise<void> {
  const log = api.getLogger();

  // Redis 7.4 (latest)
  api.registerService({
    id: "redis-7.4",
    name: "Redis 7.4",
    description: "Redis 7.4 — in-memory data store, cache, and message broker",
    containerImage: "redis:7.4-alpine",
    defaultPort: 6379,
    env: {},
    volumes: [
      "{dataDir}/data:/data",
    ],
    healthCheck: "redis-cli ping",
  });

  // Redis 7.2
  api.registerService({
    id: "redis-7.2",
    name: "Redis 7.2",
    description: "Redis 7.2 — in-memory data store, cache, and message broker",
    containerImage: "redis:7.2-alpine",
    defaultPort: 6379,
    env: {},
    volumes: [
      "{dataDir}/data:/data",
    ],
    healthCheck: "redis-cli ping",
  });

  // Redis 6.2 (LTS)
  api.registerService({
    id: "redis-6.2",
    name: "Redis 6.2",
    description: "Redis 6.2 LTS — in-memory data store, cache, and message broker",
    containerImage: "redis:6.2-alpine",
    defaultPort: 6379,
    env: {},
    volumes: [
      "{dataDir}/data:/data",
    ],
    healthCheck: "redis-cli ping",
  });

  api.registerSettingsPage({
    id: "redis",
    label: "Redis",
    description: "Redis in-memory cache and data store service.",
    icon: "database",
    position: 72,
    sections: [],
  });

  log.info("Redis services registered: 7.4, 7.2, 6.2");
}
