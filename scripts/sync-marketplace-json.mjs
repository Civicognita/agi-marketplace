#!/usr/bin/env node
/**
 * sync-marketplace-json.mjs — make marketplace.json reflect plugin source.
 *
 * marketplace.json is the catalog index that the gateway's catalog-fetcher
 * reads over HTTP. For plugin entries whose `source` is a relative path
 * (./plugins/<dir>), the source of truth for version + description lives in
 * that plugin's `package.json` (under `version` + `aionima.description`).
 *
 * This script walks marketplace.json, finds every relative-source entry, reads
 * the matching package.json, and rewrites the catalog entry's `version` and
 * `description` to match. Any version-bump to a plugin's package.json MUST be
 * followed by a run of this script or the catalog will silently advertise the
 * old version and `checkUpdates()` will never detect the change.
 *
 * Usage:
 *   node scripts/sync-marketplace-json.mjs
 *   node scripts/sync-marketplace-json.mjs --check    # exit 1 if drift found
 *
 * Intended as a pre-commit / CI gate in the marketplace repo.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const CATALOG_PATH = join(REPO_ROOT, "marketplace.json");

const checkOnly = process.argv.includes("--check");

const catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf-8"));
const changes = [];
const warnings = [];

for (const entry of catalog.plugins) {
  const src = typeof entry.source === "string" ? entry.source : null;
  if (!src || !src.startsWith("./plugins/")) continue;

  const pkgPath = join(REPO_ROOT, src, "package.json");
  if (!existsSync(pkgPath)) {
    warnings.push(`${entry.name}: source path ${src} has no package.json`);
    continue;
  }
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const pkgVer = pkg.version;
  const pkgDesc = pkg.aionima?.description;
  const pkgId = pkg.aionima?.id;

  if (pkgId && pkgId !== entry.name) {
    warnings.push(`${src}: aionima.id="${pkgId}" does not match marketplace name="${entry.name}"`);
  }

  if (pkgVer && entry.version !== pkgVer) {
    changes.push(`${entry.name}: version ${entry.version ?? "<none>"} -> ${pkgVer}`);
    entry.version = pkgVer;
  }
  if (pkgDesc && entry.description !== pkgDesc) {
    changes.push(`${entry.name}: description updated`);
    entry.description = pkgDesc;
  }
}

if (warnings.length > 0) {
  console.error("Warnings:");
  for (const w of warnings) console.error(`  ${w}`);
}

if (changes.length === 0) {
  console.log("marketplace.json is in sync with plugin package.json files.");
  process.exit(0);
}

if (checkOnly) {
  console.error(`Drift detected (${changes.length} change${changes.length === 1 ? "" : "s"}):`);
  for (const c of changes) console.error(`  ${c}`);
  console.error("");
  console.error("Run `node scripts/sync-marketplace-json.mjs` (without --check) to fix.");
  process.exit(1);
}

writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");
console.log(`${changes.length} change${changes.length === 1 ? "" : "s"} written to marketplace.json:`);
for (const c of changes) console.log(`  ${c}`);
