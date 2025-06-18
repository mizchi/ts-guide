# Deno Project Setup Guide

## Quick Start

```bash
# Create new Deno project
mkdir my-deno-project && cd my-deno-project

# Create deno.jsonc configuration file
cat > deno.jsonc << 'EOF'
{
  "tasks": {
    "dev": "deno run --watch src/mod.ts",
    "test": "deno test --reporter=dot",
    "test:cov": "deno test --coverage=coverage && deno coverage coverage",
    "check": "deno check **/*.ts && deno lint && deno fmt --check && deno test --reporter=dot"
  },
  "imports": {},
  "exports": {
    ".": "./src/mod.ts"
  },
  "lint": {
    "include": ["src/"],
    "exclude": ["coverage/"],
    "rules": {
      "tags": ["recommended"],
      "exclude": ["no-explicit-any", "no-console"]
    }
  }
}
EOF

# Create source directory
mkdir src

# Add test dependencies
deno add jsr:@std/expect
```

## Project Structure

```
my-deno-project/
├── src/
│   ├── mod.ts        # Main entry point
│   └── mod.test.ts   # Tests
├── deno.jsonc        # Configuration
└── .gitignore
```

## Configuration Details

### exports
パッケージのエントリーポイントを定義します。JSRやnpmで公開する際に重要です：
```jsonc
"exports": {
  ".": "./src/mod.ts"
}
```

### lint
Denoの組み込みリンターの設定：
```jsonc
"lint": {
  "include": ["src/"],           // リント対象ディレクトリ
  "exclude": ["coverage/"],      // 除外ディレクトリ
  "rules": {
    "tags": ["recommended"],     // 推奨ルールセット
    "exclude": [                 // 除外するルール
      "no-explicit-any",         // any型の使用を許可
      "no-console"               // console.logの使用を許可
    ]
  }
}
```

## Initial Source Files

Create the main module and test files:

```bash
# Create main module
cat > src/mod.ts << 'EOF'
/**
 * Main module export
 */
export function mod(): string {
  return "Hello from Deno!";
}
EOF

# Create test file
cat > src/mod.test.ts << 'EOF'
import { expect } from "@std/expect";
import { mod } from "./mod.ts";

Deno.test("basic test", () => {
  expect(mod()).toBe("Hello from Deno!");
});

Deno.test("return type test", () => {
  const result = mod();
  expect(typeof result).toBe("string");
});
EOF
```

## VS Code Configuration

Create `.vscode/settings.json` to enable Deno support:

```bash
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "deno.enable": true,
  "deno.lint": true
}
EOF
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
2. `deno.jsonc` と必要なファイルを手動で作成
3. `deno fmt` で全ファイルをフォーマット
4. `deno task check` でプロジェクトの整合性を確認

詳細は [setup-log.md](./setup-log.md) を参照してください。

### なぜ `deno init` を使わないのか

`deno init` は以下の制限があるため、手動でファイルを作成することを推奨します：

- `deno.json` しか生成できない（`deno.jsonc` は生成不可）
- デフォルトファイル名が `main.ts` で、プロジェクト規約と異なる
- 生成されたファイルの削除と再作成が必要になる
