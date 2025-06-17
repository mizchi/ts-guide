# ts-guide

A collection of auxiliary documents for TypeScript project initial setup.

This repository provides guidelines and documentation to efficiently bootstrap new TypeScript projects.

## Quick Start

To quickly create a new project using this template:

```bash
# Put this document under your `docs/ts-guide`
npx -y tiged mizchi/ts-guide/docs/ts-guide ./docs/ts-guide
# run with claude code
claude "Setup this project by docs/ts-guide/_init.md"
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

## license

MIT
