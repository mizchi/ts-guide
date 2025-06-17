# Project Setup Guide

This document records the setup process for this TypeScript project based on the Gist: https://gist.github.com/mizchi/9f1ef81368507e6ca410779101260d7e

## Baseline Setup

Always perform baseline setup:

- pnpm
- typescript
- vitest

```bash
pnpm init --init-type module
pnpm add typescript vitest @vitest/coverage-v8 @types/node -D
echo "node_modules\ntmp\ncoverage" > .gitignore
mkdir -p src

# git
git init
git add .
git commit -m "init"
```

package.json

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:cov": "vitest run --coverage"
  },
  "license": "MIT",
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

tsconfig.json

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "esModuleInterop": true,
    "allowImportingTsExtensions": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["vitest/importMeta"]
  }
}
```

vitest.config.ts

```typescript
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    includeSource: ["src/**/*.{ts}"],
    include: ["src/**/*.{test,spec}.{ts}"],
  },
});
```

Entry point: src/index.ts

```typescript
/**
 * このモジュールの説明
 */
export {};
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test("init", () => {
    expect(true).toBe(true);
  });
}
```

.github/workflows/ci.yaml

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm typecheck
```

## Optional: PROMPT

CLAUDE.md

```markdown
## Coding Rules

- File naming convention: `src/<lowerCamelCase>.ts`
- Add tests in `src/*.test.ts` for `src/*.ts`
- Use functions and function scope instead of classes
- Add `.ts` extension to imports for deno compatibility. Example: `import {} from "./x.ts"`
- Do not disable any lint rules without explicit user approval
- Export a function that matches the filename, and keep everything else as private as possible

## Additional Prompt

In our project, do not throw exceptions. Use neverthrow instead of throwing.

## Design Policy

This project follows a no-exceptions design policy:

- Do not throw exceptions in application code
- Use Result types for error handling instead of throwing
- Prefer explicit error handling over implicit exception propagation
- Choose between neverthrow library or custom Result type implementation
- All functions that can fail should return Result<T, E> instead of throwing
```

.claude/settings.json

```json
{
  "permissions": {
    "allow": ["Bash(pnpm test)", "Bash(ls:*)", "Bash(grep:*)"],
    "deny": []
  }
}
```

.mcp.json

```json
{}
```

## Optional: neverthrow

```bash
pnpm add neverthrow
```

Additional prompt:

```
In our project, do not throw exceptions. Use neverthrow instead of throwing.
```

If you choose not to use neverthrow, proceed to [02_result_types.md](02_result_types.md) for custom Result type implementation.

## Additional Steps Performed

After the initial setup, the following additional step was required:

```bash
pnpm approve-builds
```

This command was executed to approve the esbuild package build and resolve pnpm warnings related to the `"onlyBuiltDependencies": ["esbuild"]` configuration in package.json.

## Setup Summary

The following components were set up in this project:

1. **Baseline Setup**: TypeScript, Vitest, pnpm configuration
2. **Optional Components**: PROMPT files for AI assistant integration, neverthrow for error handling
3. **Build Approval**: pnpm approve-builds for esbuild
