/** Explicit success/failure result — prefer over thrown exceptions at boundaries. */
export type Result<T, E = string> = { success: true; data: T } | { success: false; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

export function resultFromThrowable<T>(fn: () => T): Result<T, string> {
  try {
    return ok(fn());
  } catch (error) {
    return err(error instanceof Error ? error.message : String(error));
  }
}

export async function resultFromThrowableAsync<T>(fn: () => Promise<T>): Promise<Result<T, string>> {
  try {
    return ok(await fn());
  } catch (error) {
    return err(error instanceof Error ? error.message : String(error));
  }
}
