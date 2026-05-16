import type { EventId } from "./entities";

// Errores tipados del bounded context events.

export type EventStoreError =
  | { kind: "unavailable" } // R1.4 — localStorage no disponible
  | { kind: "schemaUnknown"; got: unknown } // R1.3 — version inesperada
  | { kind: "corruptedStorage" } // JSON inválido o parse falla
  | { kind: "quotaExceeded" } // R1.1 — write falló por cuota
  | { kind: "notFound"; id: EventId };

export type EventValidationError = {
  kind: "validation";
  issues: Array<{ path: ReadonlyArray<string | number>; message: string }>;
};
