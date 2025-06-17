# Sync Documents and Implementation

Detect inconsistencies between documentation and actual implementation.

## Usage

```
/sync-doc
```

## What it does

1. **Scans documentation**

   - README.md files
   - Technical docs in docs/
   - API documentation
   - Design documents

2. **Verifies implementation**

   - File and directory existence
   - Scripts and commands
   - Dependencies
   - Test coverage

3. **Reports issues**

   - 🔴 Critical: Wrong paths or names
   - 🟡 Warning: Duplicate content
   - 🟢 Info: Outdated information
   - ℹ️ Gap: Missing documentation

4. **Suggests fixes**
   - Shows remediation options
   - Asks for confirmation
   - Updates documents safely

## Example

```
/sync-docs

Found 3 issues:
🔴 README.md references 'src/utils.js' but file is 'src/utils.ts'
🟡 Installation steps duplicated in README.md and docs/setup.md
ℹ️ Function 'parseConfig' is undocumented

Would you like to fix these issues? [y/N]
```
