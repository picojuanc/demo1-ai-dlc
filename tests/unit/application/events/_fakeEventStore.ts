import type { EventStore } from "@/application/events/ports/eventStore";
import type { Event, EventId } from "@/domain/events/entities";
import type { EventStoreError } from "@/domain/events/errors";
import { err, ok, type Result } from "@/shared/result";

// Fake in-memory store para tests de application. Permite forzar
// errores específicos (quotaExceeded, unavailable) y leer el estado
// final con `snapshot()`.

export interface FakeEventStoreControls {
  store: EventStore;
  snapshot(): Event[];
  seed(events: Event[]): void;
  forceErrorOn(method: "list" | "save" | "delete", error: EventStoreError | null): void;
}

export function fakeEventStore(): FakeEventStoreControls {
  let events: Event[] = [];
  const forced: Partial<Record<"list" | "save" | "delete", EventStoreError>> = {};

  const store: EventStore = {
    async list(): Promise<Result<Event[], EventStoreError>> {
      if (forced.list) return err(forced.list);
      return ok([...events]);
    },
    async save(event: Event): Promise<Result<void, EventStoreError>> {
      if (forced.save) return err(forced.save);
      const idx = events.findIndex((e) => e.id === event.id);
      if (idx >= 0) events[idx] = event;
      else events.push(event);
      return ok(undefined);
    },
    async delete(id: EventId): Promise<Result<void, EventStoreError>> {
      if (forced.delete) return err(forced.delete);
      const before = events.length;
      events = events.filter((e) => e.id !== id);
      if (events.length === before) return err({ kind: "notFound", id });
      return ok(undefined);
    },
  };

  return {
    store,
    snapshot: () => [...events],
    seed: (next) => {
      events = [...next];
    },
    forceErrorOn: (method, error) => {
      if (error) forced[method] = error;
      else delete forced[method];
    },
  };
}
