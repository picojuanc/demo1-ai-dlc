import type { EventStore } from "@/application/events/ports/eventStore";
import type { Event, EventId } from "@/domain/events/entities";
import type { EventStoreError } from "@/domain/events/errors";
import { persistedSchema, type Persisted } from "@/domain/events/schemas";
import { err, ok, type Result } from "@/shared/result";

// DEC-1: implementación síncrona de `localStorage` detrás de un puerto
// async. Permite migrar a IndexedDB sin tocar use cases.

const STORAGE_KEY = "dad_events_v1";

export interface LocalStorageEventStoreDeps {
  storage: Storage;
}

export function makeLocalStorageEventStore(deps: LocalStorageEventStoreDeps): EventStore {
  const { storage } = deps;

  async function readPersisted(): Promise<Result<Event[], EventStoreError>> {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return ok([]);

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return err({ kind: "corruptedStorage" });
    }

    // R1.3 — versión desconocida tiene precedencia sobre cualquier otro
    // error de schema; reportar con la versión que se encontró.
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "version" in parsed &&
      (parsed as { version: unknown }).version !== 1
    ) {
      return err({
        kind: "schemaUnknown",
        got: (parsed as { version: unknown }).version,
      });
    }

    const result = persistedSchema.safeParse(parsed);
    if (!result.success) return err({ kind: "corruptedStorage" });
    return ok(result.data.events);
  }

  function writePersisted(events: Event[]): Result<void, EventStoreError> {
    const payload: Persisted = { version: 1, events };
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return ok(undefined);
    } catch (e) {
      if (isQuotaError(e)) return err({ kind: "quotaExceeded" });
      return err({ kind: "unavailable" });
    }
  }

  return {
    async list() {
      return readPersisted();
    },

    async save(event: Event) {
      const current = await readPersisted();
      if (!current.ok) return err(current.error);

      const idx = current.value.findIndex((e) => e.id === event.id);
      const next =
        idx >= 0 ? current.value.map((e, i) => (i === idx ? event : e)) : [...current.value, event];

      return writePersisted(next);
    },

    async delete(id: EventId) {
      const current = await readPersisted();
      if (!current.ok) return err(current.error);

      const idx = current.value.findIndex((e) => e.id === id);
      if (idx < 0) return err({ kind: "notFound", id });

      const next = [...current.value.slice(0, idx), ...current.value.slice(idx + 1)];
      return writePersisted(next);
    },
  };
}

function isQuotaError(e: unknown): boolean {
  if (typeof e !== "object" || e === null) return false;
  const err = e as { name?: unknown; code?: unknown };
  if (err.name === "QuotaExceededError") return true;
  // Legacy WebKit / Firefox códigos numéricos.
  if (err.code === 22 || err.code === 1014) return true;
  return false;
}
