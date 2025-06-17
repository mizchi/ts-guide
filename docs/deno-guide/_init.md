# Deno Project Setup Guide

(WIP: Not tested)

## Quick Start

```bash
# Create new Deno project
mkdir my-deno-project && cd my-deno-project
deno init --lib

# Add test dependencies
deno add jsr:@std/expect
```

## Project Structure

```
my-deno-project/
├── src/
│   ├── mod.ts        # Main entry point
│   └── mod_test.ts   # Tests
├── deno.jsonc        # Configuration
└── .gitignore
```

## Configuration: deno.jsonc

```jsonc
{
  "tasks": {
    "dev": "deno run --watch src/mod.ts",
    "test": "deno test",
    "check": "deno check **/*.ts && deno lint && deno fmt --check && deno test"
  },
  "imports": {
    // Managed by deno add
  }
}
```

## Essential Commands

```bash
# Development
deno run src/mod.ts          # Run code
deno test                    # Run tests
deno fmt                     # Format code
deno lint                    # Lint code
deno check src/mod.ts        # Type check

# Package management
deno add jsr:@std/expect     # Add JSR package
deno add npm:zod@4           # Add npm package
deno install                 # Install from deno.jsonc

# Tasks
deno task dev                # Run with watch
deno task check              # Run all checks
```

## Writing Tests

```typescript
// src/mod_test.ts
import { expect } from "@std/expect";

Deno.test("basic test", () => {
  expect(1 + 1).toBe(2);
});

Deno.test("object test", () => {
  expect({ name: "Deno" }).toEqual({ name: "Deno" });
});
```

## Permissions

Deno is secure by default:

```bash
deno run --allow-net server.ts       # Network access
deno run --allow-read file.ts        # Read files
deno run -A script.ts                # All permissions
```

## Key Features

- **Zero config**: TypeScript, testing, formatting, and linting built-in
- **Secure by default**: Explicit permissions required
- **JSR packages**: Modern JavaScript registry
- **No node_modules**: Global dependency cache
- **Web standards**: fetch, URL, and other web APIs
