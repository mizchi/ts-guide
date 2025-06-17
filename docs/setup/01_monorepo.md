# Monorepo Setup Guide

This document describes how to convert this project into a monorepo structure using `packages/*`.

## Directory Structure

```
project-root/
├── packages/
│   ├── package-a/
│   │   ├── package.json
│   │   ├── src/
│   │   └── ...
│   ├── package-b/
│   │   ├── package.json
│   │   ├── src/
│   │   └── ...
│   └── ...
├── package.json (workspace root)
├── pnpm-workspace.yaml
└── ...
```

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
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "typecheck": "pnpm -r typecheck",
    "lint": "pnpm -r lint",
    "dev": "pnpm -r dev"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "@vitest/coverage-v8": "3.2.3",
    "typescript": "^5.8.3",
    "vitest": "^3.2.3"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["esbuild"]
  }
}
```

### 3. Create Package Structure

For each package in `packages/`, create:

#### packages/[package-name]/package.json

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
    "build": "tsc",
    "test": "vitest run",
    "test:cov": "vitest run --coverage",
    "typecheck": "tsc --noEmit",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "neverthrow": "^8.2.0"
  },
  "devDependencies": {
    "@types/node": "workspace:*",
    "@vitest/coverage-v8": "workspace:*",
    "typescript": "workspace:*",
    "vitest": "workspace:*"
  }
}
```

#### packages/[package-name]/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmit": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

#### packages/[package-name]/src/index.ts

```typescript
/**
 * Package description
 */

// Export the main function that matches the package name
export function packageName() {
  // Implementation
}

// Private functions and utilities
function privateHelper() {
  // Implementation
}
```

### 4. Workspace Commands

Common pnpm workspace commands:

```bash
# Install dependencies for all packages
pnpm install

# Run a command in all packages
pnpm -r build
pnpm -r test
pnpm -r typecheck

# Run a command in a specific package
pnpm --filter @your-scope/package-name build

# Add a dependency to a specific package
pnpm --filter @your-scope/package-name add lodash

# Add a workspace dependency
pnpm --filter @your-scope/package-a add @your-scope/package-b
```

### 5. Cross-Package Dependencies

To use one package in another:

```typescript
// In packages/package-a/src/index.ts
import { packageB } from "@your-scope/package-b";

export function packageA() {
  return packageB();
}
```

Make sure to add the dependency in package.json:

```json
{
  "dependencies": {
    "@your-scope/package-b": "workspace:*"
  }
}
```

### 6. Build Order

pnpm automatically handles build order based on dependencies. For manual control, you can use:

```bash
# Build packages in dependency order
pnpm -r --workspace-concurrency=1 build
```

## Migration from Single Package

1. Move existing `src/` to `packages/core/src/`
2. Create `packages/core/package.json` based on the template above
3. Update imports in other packages to use `@your-scope/core`
4. Create `pnpm-workspace.yaml`
5. Update root `package.json`
6. Run `pnpm install` to link workspace dependencies

## Best Practices

- Use consistent naming: `@your-scope/package-name`
- Keep packages focused and cohesive
- Use workspace dependencies (`workspace:*`) for internal packages
- Maintain shared configuration in the root
- Use `pnpm -r` commands for operations across all packages
- Consider using changesets for versioning and publishing
