import type { EventStore } from "@/application/events/ports/eventStore";
import type { Event } from "@/domain/events/entities";
import type { EventStoreError } from "@/domain/events/errors";
import type { Result } from "@/shared/result";

export interface ListEventsDeps {
  store: EventStore;
}

export type ListEvents = () => Promise<Result<Event[], EventStoreError>>;

export function makeListEvents(deps: ListEventsDeps): ListEvents {
  return () => deps.store.list();
}
