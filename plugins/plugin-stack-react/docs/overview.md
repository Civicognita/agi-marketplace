# React

React package stack for use within a monorepo. Provides tooling and dev commands for a React component library or standalone app that shares the parent project's hosting rather than running its own container.

## What It Provides

- React package configuration within a monorepo
- Standard npm dev commands wired to Aionima tools
- No dedicated container — inherits hosting from the parent project

## When to Use This Stack

Use this stack for React packages inside a monorepo that are not standalone hosted apps:

- Component libraries shared across multiple packages
- React apps in a workspace that are built by the root package
- Sub-packages within a Turborepo or pnpm workspace

For a standalone React SPA that needs its own hosting, use **React (Vite)** instead.

## Getting Started

```bash
npm install
npm run dev      # Start dev server (if this package has one)
npm run build    # Build the package
npm test         # Run tests
npm run lint     # Lint the package
```

## Notes

This stack does not register a container. It attaches tools and dev commands to the project but relies on the parent monorepo's build pipeline and hosting setup to actually run the code.

## Available Tools

npm install, npm run dev, npm run build.
