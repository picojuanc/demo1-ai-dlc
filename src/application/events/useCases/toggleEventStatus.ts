import type { EventStore } from "@/application/events/ports/eventStore";
import type { Event } from "@/domain/events/entities";
import type { EventStoreError } from "@/domain/events/errors";
import { err, ok, type Result } from "@/shared/result";

export interface ToggleEventStatusDeps {
  store: EventStore;
  clock: () => string;
}

export type ToggleEventStatus = (existing: Event) => Promise<Result<Event, EventStoreError>>;

export function makeToggleEventStatus(deps: ToggleEventStatusDeps): ToggleEventStatus {
  return async (existing) => {
    const updated: Event = {
      ...existing,
      status: existing.status === "done" ? "not-done" : "done",
      updatedAt: deps.clock(),
    };
    const saved = await deps.store.save(updated);
    if (!saved.ok) return err(saved.error);
    return ok(updated);
  };
}
