import type { EventStore } from "@/application/events/ports/eventStore";
import type { EventId } from "@/domain/events/entities";
import type { EventStoreError } from "@/domain/events/errors";
import type { Result } from "@/shared/result";

export interface DeleteEventDeps {
  store: EventStore;
}

export type DeleteEvent = (id: EventId) => Promise<Result<void, EventStoreError>>;

export function makeDeleteEvent(deps: DeleteEventDeps): DeleteEvent {
  return (id) => deps.store.delete(id);
}
