import type { Event, EventId } from "@/domain/events/entities";
import type { EventStoreError } from "@/domain/events/errors";
import type { Result } from "@/shared/result";

// Puerto async (DEC-1): preserva la opción de migrar a IndexedDB o
// backend sin tocar use cases. `save` actúa como upsert.
export interface EventStore {
  list(): Promise<Result<Event[], EventStoreError>>;
  save(event: Event): Promise<Result<void, EventStoreError>>;
  delete(id: EventId): Promise<Result<void, EventStoreError>>;
}
