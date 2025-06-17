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

/**
 * Creates a successful Result
 * @param value - The success value
 * @returns Ok result containing the value
 * @example
 * ```typescript
 * const result = ok(42);
 * if (result._tag === 'Ok') {
 *   console.log(result.value); // 42
 * }
 * ```
 */
export function ok<T>(value: T): Ok<T> {
  return { _tag: "Ok", value };
}

/**
 * Creates an error Result
 * @param error - The error value
 * @returns Err result containing the error
 * @example
 * ```typescript
 * const result = err('Something went wrong');
 * if (result._tag === 'Err') {
 *   console.log(result.error); // 'Something went wrong'
 * }
 * ```
 */
export function err<E>(error: E): Err<E> {
  return { _tag: "Err", error };
}

/**
 * Type guard to check if result is Ok
 * @param result - The result to check
 * @returns true if result is Ok
 * @example
 * ```typescript
 * const result: Result<number, string> = ok(42);
 * if (isOk(result)) {
 *   console.log(result.value); // TypeScript knows this is number
 * }
 * ```
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result._tag === "Ok";
}

/**
 * Type guard to check if result is Err
 * @param result - The result to check
 * @returns true if result is Err
 * @example
 * ```typescript
 * const result: Result<number, string> = err('error');
 * if (isErr(result)) {
 *   console.log(result.error); // TypeScript knows this is string
 * }
 * ```
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result._tag === "Err";
}

/**
 * Wraps a function that might throw into a Result
 * @param fn - Function that might throw
 * @param errorHandler - Optional function to transform the error
 * @returns Result containing either the return value or the error
 * @example
 * ```typescript
 * const result = fromThrowable(() => {
 *   return JSON.parse('{"valid": "json"}');
 * });
 *
 * if (isOk(result)) {
 *   console.log(result.value); // { valid: 'json' }
 * }
 *
 * const resultWithHandler = fromThrowable(
 *   () => JSON.parse('invalid json'),
 *   (error) => `Parse error: ${error}`
 * );
 * ```
 */
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

/**
 * Wraps a Promise into a Result
 * @param promise - Promise to wrap
 * @param errorHandler - Optional function to transform the error
 * @returns Promise of Result containing either the resolved value or the error
 * @example
 * ```typescript
 * const result = await fromAsyncThrowable(
 *   fetch('/api/data').then(r => r.json())
 * );
 *
 * if (isOk(result)) {
 *   console.log(result.value); // API response data
 * } else {
 *   console.error(result.error); // Network or parsing error
 * }
 *
 * const resultWithHandler = await fromAsyncThrowable(
 *   fetch('/api/data'),
 *   (error) => `Network error: ${error}`
 * );
 * ```
 */
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
