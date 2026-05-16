// Result<T, E> tipado — política de error de stack/patterns.md.
// Errores de negocio son valores, no excepciones.

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
