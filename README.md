# Aionima Official Marketplace

Official plugin catalog for the [Aionima](https://github.com/Civicognita/aionima) autonomous AI gateway.

## Structure

The catalog lives at `.claude-plugin/marketplace.json` and follows the Claude Code marketplace format.

## Adding Plugins

To add a plugin to the catalog, submit a PR that adds an entry to the `plugins` array in `.claude-plugin/marketplace.json`.

Each entry requires:
- `name` — unique plugin identifier
- `description` — short description
- `version` — semantic version
- `type` — `"plugin"` or `"channel"`
- `source` — where to find the plugin code
- `tags` — categorization tags
- `keywords` — search keywords
