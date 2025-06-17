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

## Optional: AI Assistant Prompt Setup

Choose one of the following options for AI assistant integration:

- **None**: Skip AI assistant setup
- **Claude (Anthropic)**: For use with Claude Desktop or API
- **Cursor**: For Cursor IDE integration
- **Cline (formerly Claude Dev)**: For VS Code extension
- **Roo**: For RooCode assistant

For detailed setup instructions, see [agent_prompt.md](03_prompt.md).

## Optional: Error Handling

Choose `neverthrow` or lightweight local result types.

```bash
pnpm add neverthrow
```

Additional prompt:

```
In our project, do not throw exceptions. Use neverthrow instead of throwing.
```

If you choose not to use neverthrow, proceed to [result_types.md](result_types.md) for custom Result type implementation.

## Additional Steps Performed

After the initial setup, the following additional step was required:

```bash
pnpm approve-builds
```

This command was executed to approve the esbuild package build and resolve pnpm warnings related to the `"onlyBuiltDependencies": ["esbuild"]` configuration in package.json.

## Post-Actions (Additional Setup Options)

After completing the initial project setup, the following options can be added as needed.

### 1. Bundler

Bundler setup with Vite or tsdown is available. See **[bundler.md](bundler.md)** for details.

### 2. Workspace

Workspace conversion and Turborepo integration setup is available. See **[workspace.md](workspace.md)** for details.

### 3. Linter

Linter setup with ESLint or oxlint is available. See **[linter.md](linter.md)** for details.

## Setup Summary

The following components were set up in this project:

1. **Baseline Setup**: TypeScript, Vitest, pnpm configuration
2. **Optional Components**: PROMPT files for AI assistant integration, error handling
3. **Build Approval**: pnpm approve-builds for esbuild
4. **Post-Actions**: Bundler options (Vite/tsdown), Monorepo setup, Linting tools (ESLint/oxlint)
