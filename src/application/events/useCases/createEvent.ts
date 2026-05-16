import type { EventStore } from "@/application/events/ports/eventStore";
import type { Event } from "@/domain/events/entities";
import type { EventStoreError, EventValidationError } from "@/domain/events/errors";
import { eventInputSchema, type EventInput } from "@/domain/events/schemas";
import { err, ok, type Result } from "@/shared/result";

import { toValidationError } from "./_validation";

export interface CreateEventDeps {
  store: EventStore;
  clock: () => string;
  newId: () => string;
}

export type CreateEvent = (
  input: EventInput,
) => Promise<Result<Event, EventValidationError | EventStoreError>>;

export function makeCreateEvent(deps: CreateEventDeps): CreateEvent {
  return async (input) => {
    const parsed = eventInputSchema.safeParse(input);
    if (!parsed.success) return err(toValidationError(parsed.error));

    const now = deps.clock();
    const event: Event = {
      id: deps.newId(),
      title: parsed.data.title,
      start: parsed.data.start,
      end: parsed.data.end,
      allDay: parsed.data.allDay,
      status: "not-done",
      createdAt: now,
      updatedAt: now,
    };

    const saved = await deps.store.save(event);
    if (!saved.ok) return err(saved.error);
    return ok(event);
  };
}
