# npm Compatibility

## Important: Never Use HTTP Imports

**DO NOT use HTTP imports like `https://deno.land/x/...`**. Always use:
- JSR packages (preferred): `jsr:@scope/package`
- npm packages (fallback): `npm:package@version`

## Using npm Packages

When JSR packages aren't available, use npm:

```bash
# Add npm packages when JSR not available
deno add npm:zod@4
deno add npm:@types/node --dev
```

## Import Examples

```typescript
// Standard library from JSR
import { expect } from "@std/expect";

// npm packages (when JSR not available)
import { z } from "npm:zod@4";

// Node.js built-ins
import fs from "node:fs/promises";
import path from "node:path";

// NEVER DO THIS:
// import { something } from "https://deno.land/x/...";  // ❌ Avoid HTTP imports
```

## Common npm Packages

```typescript
// Validation
import { z } from "npm:zod@4";
import Joi from "npm:joi@17";

// Database
import mongoose from "npm:mongoose@8";
import { createClient } from "npm:@supabase/supabase-js@2";

// Utilities
import _ from "npm:lodash@4";
import dayjs from "npm:dayjs@1";
```

## Migration Tips

1. **Prefer JSR**: Always check JSR first before using npm
2. **Pin versions**: Use exact versions for reproducibility
3. **Node compatibility**: Some packages may need `--node-modules-dir` flag
4. **Types**: Add `@types/*` packages when TypeScript support is missing

```bash
# Run with Node modules directory (if needed)
deno run --node-modules-dir app.ts
```
