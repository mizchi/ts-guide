# AI Assistant Prompt Setup Guide

This guide covers setup for known coding agents:

- Claude (Anthropic)
- Cursor IDE
- Cline (VS Code extension)
- Roo Code
- GitHub Copilot

## Base Prompt (Shared)

All AI assistants use this common base prompt:

```
## Coding Rules
- File naming convention: `src/<lowerCamelCase>.ts`
- Add tests in `src/*.test.ts` for `src/*.ts`
- Use functions and function scope instead of classes
- Add `.ts` extension to all imports
- Export a function that matches the filename, keep everything else private
- **IMPORTANT**: Always run `deno task check` before committing
- **NEVER** use HTTP imports like `https://deno.land/x/...`
- Always use JSR (`jsr:`) or npm (`npm:`) imports
- Use `@std/expect` for testing instead of `@std/assert`

## Import Rules
- Prefer JSR packages: `jsr:@scope/package`
- Use npm only when JSR not available: `npm:package@version`
- Node.js built-ins: use `node:` prefix (e.g., `import fs from "node:fs"`)
- NEVER use `https://` imports

## Functional Programming Style
- Prefer functions over classes for business logic
- Use pure functions whenever possible
- Minimize side effects and encapsulate them clearly
- Use function composition for complex operations
- Keep functions small and focused on a single responsibility

## Error Handling Policy

This project follows a strict no-exceptions design policy:

- **NEVER throw exceptions** in application code
- **ALWAYS use Result types** for error handling instead of throwing
- **ALL functions that can fail** must return `Result<T, E>` instead of throwing
- Use explicit error handling over implicit exception propagation

### Result Type Implementation

Choose one of the following implementations:

**Option 1: neverthrow library (Recommended)**

- Install: `pnpm add neverthrow`
- Import: `import { Result, ok, err } from "neverthrow"`
- Use `result.isOk()` and `result.isErr()` for type checking

**Option 2: Custom Result type**

- Use the custom implementation from `src/utils/result.ts`
- Import: `import { Result, ok, err, isOk, isErr } from "./utils/result.ts"`
- Use `isOk(result)` and `isErr(result)` helper functions for type checking

### Mandatory Practices

1. **Function Return Types**: All functions that can fail must return `Result<SuccessType, ErrorType>`
2. **Error Checking**: Always use `isOk()` / `isErr()` or `result.isOk()` / `result.isErr()` for type-safe error checking
3. **No Exception Throwing**: Never use `throw` statements in application code
4. **Async Operations**: Wrap promises with `fromAsyncThrowable()` when using custom Result type
5. **External Libraries**: Wrap third-party code that might throw using `fromThrowable()` or `fromAsyncThrowable()`
```

## Assistant Configurations

### Claude

**When to use:** Claude API integration

**Base file:** `CLAUDE.md`
**Additional files:** `.claude/settings.json`, `.mcp.json`

### Cursor

**When to use:** Cursor IDE with built-in AI

**Base file:** `.cursor/rules/rules.md`

### Cline

**When to use:** VS Code with Cline extension

**Base file:** `.clinerules`

### Roo

**When to use:** Roo Code assistant

**Base file:** `.roo/rules/rules.md`

### GitHub Copilot

**When to use:** GitHub Copilot integration

**Base file:** `.github/copilot-instructions.md`

## Deno-Specific Rules

Add these Deno-specific rules to your agent configuration:

```
## Deno Development Rules
- Use `deno.jsonc` for configuration (not package.json)
- Run tests with `deno test`
- Format with `deno fmt`
- Lint with `deno lint`
- Use `deno add` to manage dependencies
- Default test framework is `@std/expect` (Jest-like API)
- Always specify permissions when running: `deno run --allow-net`
```