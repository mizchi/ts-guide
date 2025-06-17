# Bundler Setup Guide

This document provides concise setup instructions for Vite and tsdown bundlers.

## Vite

### Overview

Vite is a fast build tool with instant HMR (Hot Module Replacement) for modern web development.

### Setup

```bash
# Install Vite
pnpm add vite -D
```

Add scripts to package.json:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Basic Configuration (vite.config.ts)

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "MyLib",
      fileName: (format) => `my-lib.${format}.js`,
    },
  },
});
```

### Use Cases

- Frontend development with HMR
- Modern build pipeline
- Framework-agnostic projects

## tsdown

### Overview

tsdown is a fast library bundler based on Rolldown with TypeScript support.

### Setup

```bash
# Install tsdown
pnpm add tsdown -D
```

### Basic Usage

```bash
# Build library
npx tsdown
```

### Configuration (tsdown.config.ts)

```typescript
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: ["esm"],
  dts: true,
  clean: true,
});
```

### Use Cases

- Library development and publishing
- Migration from tsup
- Fast builds with type definitions
- TypeScript-first projects

## Comparison

| Feature          | Vite            | tsdown            |
| ---------------- | --------------- | ----------------- |
| Speed            | Fast dev server | Ultra-fast builds |
| Use Case         | Web apps        | Libraries         |
| HMR              | Yes             | No                |
| Type Definitions | Manual          | Automatic         |
| Ecosystem        | Large           | Growing           |

## Best Practices

### Vite

- Use for frontend applications
- Leverage plugins for framework integration
- Configure build.lib for library mode

### tsdown

- Use for library publishing
- Migrate gradually from tsup
- Enable DTS generation for TypeScript libraries
