## Coding Rules

- File naming convention: `src/<lowerCamelCase>.ts`
- Add tests in `src/*.test.ts` for `src/*.ts` or in `test/*.test.ts`
- Use functions and function scope instead of classes
- Add `.ts` extension to imports for deno compatibility. Example: `import {} from "./x.ts"`
- Do not disable any lint rules without explicit user approval
- Export a function that matches the filename, and keep everything else as private as possible

## Additional Prompt

In our project, do not throw exceptions. Use neverthrow instead of throwing.

## Design Policy

This project follows a no-exceptions design policy:

- Do not throw exceptions in application code
- Use Result types for error handling instead of throwing
- Prefer explicit error handling over implicit exception propagation
- Choose between neverthrow library or custom Result type implementation
- All functions that can fail should return Result<T, E> instead of throwing
