# Linter Setup Guide

This document provides concise setup instructions for ESLint, oxlint, and Biome linters.

## ESLint

### Overview

ESLint is the standard JavaScript/TypeScript linter with extensive plugin ecosystem and customizable rules.

### Setup

```bash
# Install ESLint with TypeScript support
pnpm add eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D
```

### Configuration (.eslintrc.json)

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "@typescript-eslint/recommended"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "check:file": "eslint"
  }
}
```

> **Note**: The `check:file` command allows linting specific files: `pnpm check:file src/index.ts`

### Advanced Configuration

```bash
# Add popular presets
pnpm add @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier -D
```

```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier"
  ]
}
```

## oxlint

### Overview

oxlint is a Rust-based linter that provides extremely fast linting with zero configuration.

### Overview

Biome is an all-in-one toolchain that combines linting, formatting, and import organization. Written in Rust for performance.

### Setup

```bash
# Install Biome
pnpm add -D @biomejs/biome
```

### Configuration (biome.json)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noNonNullAssertion": "off",
        "useConst": "error"
      },
      "correctness": {
        "noUnusedVariables": "error"
      }
    }
  },
  "formatter": {
    "enabled": false
  },
  "files": {
    "ignore": ["node_modules", "dist", "coverage", "*.min.js"]
  }
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "biome lint .",
    "lint:fix": "biome lint --write .",
    "check:file": "biome lint"
  }
}
```

> **Note**: The `check:file` command allows linting specific files: `pnpm check:file src/index.ts`

Note: If using Biome for linting, you can also enable its formatter and disable other formatters to have a unified toolchain.

## oxlint Setup

```bash
# Install oxlint
pnpm add oxlint -D
```

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "oxlint",
    "check:file": "oxlint"
  }
}
```

> **Note**: The `check:file` command allows linting specific files: `pnpm check:file src/index.ts`

### Configuration (.oxlintrc.json)

```json
{
  "plugins": ["promise", "import", "node"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn"
  },
  "rules": {
    "no-console": "warn",
    "typescript/no-explicit-any": "error"
  },
  "ignorePatterns": ["node_modules", "dist", "build", "coverage", "*.min.js"]
}
```

## Check Script Integration

When adding a linter, update the main `check` script to include lint checking:

```json
{
  "scripts": {
    "check": "pnpm typecheck && pnpm test && pnpm lint"
  }
}
```

If you have both formatter and linter:

```json
{
  "scripts": {
    "check": "pnpm typecheck && pnpm test && pnpm format:check && pnpm lint"
  }
}
```

## Integration with CI/CD

### GitHub Actions

```yaml
name: Lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm lint
```

## Best Practices

### ESLint

- Use with Prettier for formatting
- Extend recommended configurations
- Add project-specific rules gradually
- Use eslint-disable comments sparingly

### oxlint

- Use for performance-critical projects
- Combine with other tools for comprehensive checking
- Ideal for large codebases
- Good for CI/CD pipelines

### Biome

- Use when you want unified linting and formatting
- Excellent performance due to Rust implementation
- Good TypeScript support out of the box
- Consider for new projects or when migrating from multiple tools

## Troubleshooting

### ESLint

- **Parsing errors**: Check parser configuration
- **Rule conflicts**: Use eslint-config-prettier
- **Performance**: Use .eslintignore for large files

### oxlint

- **Missing rules**: Check oxlint documentation for supported rules
- **Configuration**: Ensure .oxlintrc.json is valid JSON
- **File patterns**: Use correct glob patterns for file matching

### Biome

- **Rule conflicts**: Disable conflicting formatters when using Biome
- **Migration**: Use `biome migrate` to convert ESLint config
- **Performance**: Generally faster than ESLint, comparable to oxlint

## Migration

### From ESLint to oxlint

1. Install oxlint
2. Create basic .oxlintrc.json
3. Test on small subset of files
4. Gradually replace ESLint scripts

### From oxlint to ESLint

1. Install ESLint with TypeScript support
2. Create .eslintrc.json with equivalent rules
3. Add necessary plugins
4. Update package.json scripts
