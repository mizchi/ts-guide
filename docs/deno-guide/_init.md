# Deno Project Setup Guide

## Quick Start

```bash
# Create new Deno project
mkdir my-deno-project && cd my-deno-project
deno init

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
    "test": "deno test --reporter=dot",
    "test:cov": "deno test --coverage=coverage && deno coverage coverage",
    "check": "deno check **/*.ts && deno lint && deno fmt --check && deno test --reporter=dot"
  },
  "imports": {
    // Managed by deno add
  }
}
```

## VS Code Configuration

Create `.vscode/settings.json` to enable Deno support:

```json
{
  "deno.enable": true,
  "deno.lint": true
}
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

## Setup Tips

### Git Worktree での開発

既存のNode.jsプロジェクトからDenoへ移行する場合、git worktreeを使用すると便利です：

```bash
# worktreeをサブディレクトリに作成
mkdir -p worktrees
git worktree add worktrees/deno deno -b deno
cd worktrees/deno
```

### 既存プロジェクトからの移行

1. Node.js関連ファイルを削除
2. `deno init` で初期化
3. デフォルトファイルを削除し、プロジェクト構造に合わせて再作成
4. `deno fmt` で全ファイルをフォーマット

詳細は [setup-log.md](./setup-log.md) を参照してください。
