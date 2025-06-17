# Library Bundler Setup Guide

This document provides setup instructions for bundling TypeScript libraries with Vite Library Mode and tsdown.

## Vite (Library Mode)

### Overview

Vite can bundle TypeScript libraries using its Library Mode. For application development, see [vite.md](vite.md).

### Setup for Libraries

```bash
# Install Vite
pnpm add -D vite
```

### Library Configuration (vite.config.ts)

```typescript
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MyLibrary",
      fileName: "my-library"
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});
```

### Package.json for Library

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-library.umd.cjs",
  "module": "./dist/my-library.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/my-library.js",
      "require": "./dist/my-library.umd.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc && vite build",
    "prepublishOnly": "pnpm build"
  }
}
```

### Use Cases

- Publishing npm packages
- Building component libraries
- Creating utility libraries

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
