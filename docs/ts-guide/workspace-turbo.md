# Turborepo Integration for Monorepo

This guide extends the basic [workspace setup](./workspace.md) with Turborepo for intelligent caching and parallel execution.

## Prerequisites

- Completed [workspace.md](./workspace.md) setup
- Node.js 24+
- pnpm 10+
- `packageManager` field in root package.json (required by Turborepo)

## Installation

```bash
pnpm add turbo -D
```

## Changes from Basic Setup

### 1. Ensure packageManager field exists

If not already present in your root package.json:

```diff
{
  "name": "your-monorepo",
  "private": true,
  "type": "module",
+ "packageManager": "pnpm@10.12.1",
  "scripts": {
```

### 2. Update .gitignore

```diff
  node_modules
  dist
+ .turbo
  coverage
  *.log
  .DS_Store
```

### 3. Create turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "lib/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 3.1. Optional: Add test scripts to packages

If you want to run tests per package with Turborepo:

```diff
# packages/*/package.json
  "scripts": {
    "build": "tsdown",
+   "test": "vitest run",
    "dev": "tsdown --watch"
  }
```

### 4. Update Root package.json

```diff
  "scripts": {
-   "build": "pnpm -r build",
+   "build": "turbo build",
    "test": "vitest run",  # or "turbo test" if using per-package tests
    "typecheck": "tsc --build",
    "lint": "oxlint",
    "format": "biome format --write .",
-   "dev": "pnpm -r dev"
+   "dev": "turbo dev"
  }
```

Note: 
- Use `vitest run` for workspace-level test execution
- Use `turbo test` if you added test scripts to individual packages
- Keep `typecheck`, `lint`, and `format` as workspace-level commands

## Verification

Run build twice to see caching in action:

```bash
# First run
pnpm build
# Output: "Cached: 0 cached, 2 total"

# Second run (without changes)
pnpm build
# Output: "Cached: 2 cached, 2 total" and "FULL TURBO"
```

## Documentation

For detailed usage, configuration options, and best practices, see the [official Turborepo documentation](https://turbo.build/repo/docs).

## GitHub Actions

Update your CI workflow for better performance:

```diff
  steps:
    - uses: actions/checkout@v4
+     with:
+       fetch-depth: 2  # Needed for change detection
    
    # ... (pnpm setup steps remain the same)
    
    - run: pnpm install --frozen-lockfile
    
-   - run: pnpm build
-   - run: pnpm test
-   - run: pnpm typecheck
-   - run: pnpm lint
+   # Build only changed packages and their dependents
+   - run: turbo build --filter=...[HEAD^1]
+   # Run other commands normally
+   - run: pnpm test
+   - run: pnpm typecheck
+   - run: pnpm lint
```

## When to Use Turborepo

Consider Turborepo when:
- You have 5+ packages in your monorepo
- Build times are becoming a bottleneck
- You want intelligent caching across CI runs
- You need better parallelization

For smaller monorepos (2-4 packages), the basic pnpm workspace setup is usually sufficient.