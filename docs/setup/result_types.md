# Result Types Setup Guide

This document describes options for error handling using Result types in this project.

## Option 1: Using neverthrow (Recommended)

Install the neverthrow package:

```bash
pnpm add neverthrow
```

Usage example:

```typescript
import { Result, ok, err } from "neverthrow";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err("Division by zero");
  }
  return ok(a / b);
}

const result = divide(10, 2);
if (result.isOk()) {
  console.log(result.value); // 5
} else {
  console.error(result.error);
}
```

## Option 2: Custom Result Type Implementation

Create a custom Result type implementation in `src/utils/result.ts`:

### Basic Implementation

```typescript
/**
 * Custom Result type implementation for error handling without exceptions
 * Simple implementation focused on TypeScript flow analysis
 */

export type Result<T, E> = Ok<T> | Err<E>;

export interface Ok<T> {
  readonly _tag: "Ok";
  readonly value: T;
}

export interface Err<E> {
  readonly _tag: "Err";
  readonly error: E;
}

export function ok<T>(value: T): Ok<T> {
  return { _tag: "Ok", value };
}

export function err<E>(error: E): Err<E> {
  return { _tag: "Err", error };
}

// Type guards for flow analysis
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result._tag === "Ok";
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result._tag === "Err";
}

// Utility functions
export function fromThrowable<T, E = Error>(
  fn: () => T,
  errorHandler?: (error: unknown) => E
): Result<T, E> {
  try {
    return ok(fn());
  } catch (error) {
    const mappedError = errorHandler ? errorHandler(error) : (error as E);
    return err(mappedError);
  }
}

export async function fromAsyncThrowable<T, E = Error>(
  promise: Promise<T>,
  errorHandler?: (error: unknown) => E
): Promise<Result<T, E>> {
  try {
    const value = await promise;
    return ok(value);
  } catch (error) {
    const mappedError = errorHandler ? errorHandler(error) : (error as E);
    return err(mappedError);
  }
}
```

### Usage Example

```typescript
import { Result, ok, err, isOk, isErr, fromThrowable } from "./utils/result.ts";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err("Division by zero");
  }
  return ok(a / b);
}

function parseNumber(str: string): Result<number, string> {
  return fromThrowable(
    () => {
      const num = Number(str);
      if (isNaN(num)) {
        throw new Error("Not a number");
      }
      return num;
    },
    (error) => `Parse error: ${error}`
  );
}

// Usage with _tag pattern matching
const result1 = divide(10, 2);
if (result1._tag === "Ok") {
  console.log(`Result: ${result1.value}`); // Result: 5
} else {
  console.error(`Error: ${result1.error}`);
}

// Usage with type guard functions
const result2 = parseNumber("42");
if (isOk(result2)) {
  console.log(`Parsed: ${result2.value}`); // TypeScript knows this is number
} else {
  console.error(`Error: ${result2.error}`); // TypeScript knows this is string
}

// Chaining operations
function calculate(aStr: string, bStr: string): Result<number, string> {
  const aResult = parseNumber(aStr);
  if (isErr(aResult)) {
    return aResult;
  }

  const bResult = parseNumber(bStr);
  if (isErr(bResult)) {
    return bResult;
  }

  return divide(aResult.value, bResult.value);
}

const result3 = calculate("10", "2");
if (isOk(result3)) {
  console.log(`10 / 2 = ${result3.value}`); // 10 / 2 = 5
}
```

## Choosing Between Options

### Use neverthrow when:

- You want a battle-tested, well-documented library
- You need additional utilities and combinators
- You prefer not to maintain custom code
- You want TypeScript-first design with excellent type inference

### Use custom Result type when:

- You want full control over the implementation
- You need to minimize dependencies
- You want to customize behavior for your specific use case
- You prefer to understand every line of code in your error handling
- You want the simplest possible implementation focused on TypeScript flow analysis

## Integration with Project Rules

Both options align with the project's coding rule: "In our project, do not throw exceptions. Use Result types instead of throwing."

Update your `CLAUDE.md` to specify which option you're using:

```markdown
## Additional Prompt

In our project, do not throw exceptions. Use Result types instead of throwing.

- Option 1: Use neverthrow library
- Option 2: Use custom Result type from `src/utils/result.ts`
```

## Key Features of Custom Implementation

- **Simple discriminated union**: Uses `_tag` property for pattern matching
- **TypeScript flow analysis**: Automatic type narrowing with `_tag` checks
- **Type guard functions**: `isOk()` and `isErr()` for explicit type checking
- **Utility functions**: `fromThrowable()` and `fromAsyncThrowable()` for common use cases
- **JSDoc examples**: Each function includes usage examples in documentation
- **Minimal dependencies**: No external libraries required
