# Monorepo Setup Guide

Convert a single package into a monorepo using pnpm workspaces, TypeScript project references, and unified tooling.

## Prerequisites

- Node.js 24+
- pnpm 10+

## When to Use Turborepo

This guide covers the basic pnpm workspace setup, which is sufficient for most small to medium monorepos (2-4 packages). 

Consider adding [Turborepo](./workspace-turbo.md) when:
- You have 5+ packages in your monorepo
- Build times are becoming a bottleneck (>30 seconds)
- You want intelligent caching across CI runs
- You need better parallelization of tasks
- You have complex dependency chains between packages

For most projects starting with a monorepo, begin with this basic setup and add Turborepo later if needed.

## Setup Steps

### 1. Create pnpm-workspace.yaml

Create `pnpm-workspace.yaml` in the project root:

```yaml
packages:
  - "packages/*"
```

### 2. Update Root package.json

Update the root `package.json` to include workspace configuration:

```json
{
  "name": "your-monorepo",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.12.1",
  "scripts": {
    "build": "pnpm -r build",
    "test": "vitest run",
    "typecheck": "tsc --build",
    "lint": "oxlint",
    "lint:strict": "oxlint --deny-warnings",
    "format": "biome format --write .",
    "check-format": "biome format .",
    "dev": "pnpm -r dev"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.0.0",
    "@types/node": "^24.0.0",
    "@vitest/coverage-v8": "3.2.3",
    "oxlint": "^0.17.1",
    "tsdown": "^0.2.20",  // Optional: only if using bundling
    "typescript": "^5.8.3",
    "vitest": "^3.2.3"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["esbuild"]
  }
}
```

### 2.1. Create TypeScript Configuration

Create a base `tsconfig.base.json` for shared configuration:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "allowImportingTsExtensions": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "types": ["vitest/importMeta"]
  }
}
```

**Note**: When using TypeScript only (Option A), remove `"allowImportingTsExtensions": true` from tsconfig.base.json as it's incompatible with emit.

And create a root `tsconfig.json` that extends the base:

```json
{
  "extends": "./tsconfig.base.json",
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" }
  ]
}
```

### 2.2. Create Vitest Configuration

Create a root `vitest.config.ts` to manage test configurations:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ["src/**/*.ts"],
  },
  projects: [
    {
      test: {
        include: ["packages/*/src/**/*.test.ts"],
        name: "packages",
      },
    },
  ],
});
```

**Note**: Vitest will automatically detect and run tests in all packages using the `projects` configuration.

### 2.3. Create Biome Configuration

Create a root `biome.json` for formatting:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "assist": {
    "enabled": true,
    "actions": {
      "recommended": false,
      "source": {
        "organizeImports": "on"
      }
    }
  },
  "linter": {
    "enabled": false
  }
}
```

### 2.4. Create .gitignore

```
node_modules
dist
.turbo
coverage
*.log
.DS_Store
```

### 3. Create Package Structure

For each package in `packages/`:

#### Option A: With TypeScript Only (Recommended for libraries)

##### package.json
```json
{
  "name": "@your-scope/package-name",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "import": "./lib/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

##### tsconfig.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src",
    "outDir": "./lib",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["lib", "node_modules"]
}
```

#### Option B: With tsdown (When bundling is needed)

##### package.json
```json
{
  "name": "@your-scope/package-name",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

##### tsconfig.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "emitDeclarationOnly": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

##### tsdown.config.ts
```typescript
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/index.ts",
  outDir: "dist",
});
```

**Note**: Use tsdown when you need bundling (e.g., for applications or packages with many small files). For libraries, TypeScript's native compilation is often sufficient.

## Workspace Commands

```bash
# Root commands
pnpm install
pnpm build         # Build all packages
pnpm test          # Test all (vitest workspace)
pnpm typecheck     # Type check all (tsc --build)
pnpm lint          # Lint all (oxlint)
pnpm format        # Format all (biome)

# Package-specific
pnpm --filter @your-scope/package-name build
pnpm --filter @your-scope/package-name add lodash

# Cross-package dependency
pnpm --filter @your-scope/package-a add @your-scope/package-b
```

## Cross-Package Dependencies

```json
// packages/utils/package.json
{
  "dependencies": {
    "@your-scope/core": "workspace:*"
  }
}
```

```json
// packages/utils/tsconfig.json
{
  "references": [
    { "path": "../core" }
  ]
}
```

## TypeScript Project References

Project references provide incremental builds and proper dependency tracking:

### Option A: TypeScript Only
- **TypeScript**: Handles both transpilation and type checking
- **Output**: `lib/` directory with `.js` and `.d.ts` files
- **Use case**: Libraries and packages without bundling needs

### Option B: With tsdown
- **TypeScript**: Type checking and declaration files only (`emitDeclarationOnly: true`)
- **tsdown**: JavaScript transpilation and bundling
- **Output**: `dist/` directory with bundled code
- **Use case**: Applications or packages requiring bundling

```bash
pnpm typecheck     # tsc --build
tsc --build --clean
tsc --build --force
```


## GitHub Actions CI

```yaml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test
      - run: pnpm typecheck
      - run: pnpm lint
```

## Next Steps

### Performance Optimization

Once your monorepo grows and build times increase, consider adding [Turborepo](./workspace-turbo.md) for:
- **Intelligent caching**: Skip rebuilding unchanged packages
- **Parallel execution**: Run tasks concurrently across packages
- **Remote caching**: Share build cache across team members and CI
- **Task orchestration**: Define complex task dependencies

The basic pnpm workspace setup is production-ready and sufficient for most projects. Add Turborepo when you actually need the performance benefits.
