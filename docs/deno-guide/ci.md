# Deno CI/CD Setup

This guide uses the tasks defined in `deno.jsonc` for consistency between local development and CI.

## GitHub Actions

Create `.github/workflows/ci.yml`:

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
      
      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x
      
      - name: Cache Deno dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.deno
            ~/.cache/deno
          key: ${{ runner.os }}-deno-${{ hashFiles('**/deno.lock') }}
      
      - name: Run checks
        run: deno task check
```

## Coverage Report

```yaml
      - name: Generate coverage
        run: deno task test:cov
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          directory: ./coverage
```

## Complete CI Configuration

Here's a comprehensive CI setup that uses all tasks from `deno.jsonc`:

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
      
      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x
      
      - name: Cache Deno dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.deno
            ~/.cache/deno
          key: ${{ runner.os }}-deno-${{ hashFiles('**/deno.lock') }}
      
      # Run all checks using the task from deno.jsonc
      - name: Run checks
        run: deno task check
      
      # Generate coverage report
      - name: Generate coverage
        run: deno task test:cov
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          directory: ./coverage
          token: ${{ secrets.CODECOV_TOKEN }}
```

## Available Tasks

The CI uses these tasks defined in `deno.jsonc`:

- `deno task check`: Runs type checking, linting, formatting check, and tests
- `deno task test:cov`: Runs tests with coverage generation

## Local Testing

Before pushing, run the same checks locally:

```bash
# Run all checks
deno task check

# Run tests with coverage
deno task test:cov
```