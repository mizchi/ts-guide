# Dead Code Elimination with tsr

`tsr` (ts-remove-unused) is a tool for detecting and removing unused TypeScript code.

```
/tsr-dce
```

## Usage

### 1. Analyze unused code (dry-run)

Find unused exports and files without making any changes:

```bash
# Single entrypoint
npx -y tsr 'src/index\.ts$'

# Multiple entrypoints
npx -y tsr 'src/index\.ts$' 'src/cli\.ts$'

# Include test files
npx -y tsr 'src/index\.ts$' '.*\.test\.ts$' '.*\.spec\.ts$'
```

Example output:

```
tsconfig tsconfig.json
Project has 3 files. Found 1 entrypoint file
export src/index.ts:6:0     'unusedFunction'
file   src/utils.ts
✖ delete 1 file, remove 1 export
```

### 2. Remove unused code automatically

Use `--write` to automatically remove unused exports and files:

```bash
# Backup your code first!
git add -A && git stash

# Run with --write
npx -y tsr --write 'src/index\.ts$'

# Review changes
git diff
```

## Important Notes

- **Dynamic imports**: Not detected by static analysis
- **Type exports**: `export type` is also analyzed
- **Backup first**: Always backup before using `--write`
- **Review changes**: Check all modifications carefully
