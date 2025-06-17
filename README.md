# ts-guide

A collection of auxiliary documents for TypeScript project initial setup.

This repository provides **opinionated** guidelines and documentation to efficiently bootstrap new TypeScript projects. It includes predefined configurations, tooling choices, and best practices based on modern TypeScript development workflows.

## Quick Start

### Option 1: Using tiged (Recommended for new projects)

To quickly create a new project using this template:

```bash
# Put this document under your `docs/ts-guide`
npx -y tiged mizchi/ts-guide/docs/ts-guide ./docs/ts-guide
# run with claude code
claude "Setup this project by docs/ts-guide/_init.md"
claude "Eject unused document by docs/ts-guide/eject.md"
```

### Option 2: Using git clone

Clone the entire repository and start from there:

```bash
git clone https://github.com/mizchi/ts-template.git your-project-name
cd your-project-name
rm -rf .git  # Remove the original git history
git init     # Initialize a new git repository

# initial setup with claude
claude "Setup this project by docs/ts-guide/_init.md"
# optional: cleanup
claude "Eject unused document by docs/ts-guide/eject.md"
```

## Usage Examples

After placing the documents in your project with tiged, you can request different types of projects:

### Create a Vite Web Application

```bash
claude "Setup this project by docs/ts-guide/_init.md. I want to create a Vite web application with React and TypeScript"
```

### Create a TypeScript Library

```bash
claude "Setup this project by docs/ts-guide/_init.md. I'm building a TypeScript library that will be published to npm"
```

### Create a CLI Tool

```bash
claude "Setup this project by docs/ts-guide/_init.md. I need a CLI application with command parsing and TypeScript support"
```

### Advanced: Functional Programming Setup

```bash
claude "Setup this project by docs/ts-guide/_init.md. I want to use functional programming patterns with fp-ts or neverthrow"
```

The agent will dynamically determine which documents to use based on your requirements.

## Opinionated Choices

This template includes several opinionated decisions:

- **Package Manager**: pnpm (for better performance and disk space efficiency)
- **Formatter**: Biome (fast, all-in-one formatter)
- **Linter**: oxlint (high-performance linter)
- **Test Runner**: Vitest (fast, ESM-first test runner)
- **Error Handling**: neverthrow (no-exceptions policy with Result types)
- **CI/CD**: GitHub Actions with comprehensive checks
- **TypeScript**: Strict configuration with modern ESM support

These choices are based on performance, developer experience, and modern best practices. You can customize them after initial setup if needed.

## license

MIT
