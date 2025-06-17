# CLI Development with Deno

## Basic CLI Example

Create `src/cli.ts`:

```typescript
#!/usr/bin/env -S deno run
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  options: {
    version: {
      type: "boolean",
      short: "v",
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (values.version) {
  console.log("mycli v1.0.0");
  Deno.exit(0);
}

if (values.help) {
  console.log(`
Usage: mycli [options] <command>

Commands:
  build    Build the project
  test     Run tests
  fmt      Format code

Options:
  -v, --version    Show version
  -h, --help       Show help
`);
  Deno.exit(0);
}

const command = positionals[0];

switch (command) {
  case "build":
    console.log("Building project...");
    break;
  case "test":
    console.log("Running tests...");
    break;
  case "fmt":
    console.log("Formatting code...");
    break;
  default:
    console.error(`Unknown command: ${command}`);
    Deno.exit(1);
}
```

## Configure deno.jsonc

Set up CLI as an export in `deno.jsonc`:

```jsonc
{
  "name": "@myorg/mycli",
  "version": "1.0.0",
  "exports": {
    ".": "./src/mod.ts",
    "./cli": "./src/cli.ts"
  },
  "tasks": {
    "cli": "deno run src/cli.ts"
  },
  "imports": {
    // Dependencies managed by deno add
  }
}
```

## Running the CLI

```bash
# Run directly
deno run src/cli.ts build
deno run src/cli.ts --help

# Run via task
deno task cli build

# Install globally
deno install -Afg --name mycli ./src/cli.ts

# Now use anywhere
mycli build
mycli --help

# Compile to binary
deno compile --output mycli ./src/cli.ts
./mycli build
```

## Using dax for Shell Commands

For more complex CLI tools, use dax:

```bash
deno add jsr:@david/dax
```

```typescript
// src/cli.ts with dax
import $ from "@david/dax";
import { parseArgs } from "node:util";

const { positionals } = parseArgs({
  allowPositionals: true,
});

const command = positionals[0];

switch (command) {
  case "build": {
    // Run shell commands
    await $`deno check **/*.ts`;
    await $`deno fmt`;
    await $`deno lint`;
    console.log("✓ Build complete");
    break;
  }
  case "deploy": {
    // Interactive prompts
    const env = await $.select({
      message: "Select environment:",
      options: ["production", "staging"],
    });
    
    if (await $.confirm(`Deploy to ${env}?`)) {
      await $`deno deploy --project=${env}`;
    }
    break;
  }
  default:
    console.error(`Unknown command: ${command}`);
    Deno.exit(1);
}
```