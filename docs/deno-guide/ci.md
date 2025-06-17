# Deno CI/CD Setup

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
      
      - name: Install dependencies
        run: deno install
      
      - name: Run checks
        run: |
          deno fmt --check
          deno lint
          deno check **/*.ts
          deno test -A
```

## Coverage Report

```yaml
      - name: Generate coverage
        run: deno test -A --coverage=coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          directory: ./coverage
```