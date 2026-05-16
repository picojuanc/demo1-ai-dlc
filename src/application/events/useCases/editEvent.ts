import type { EventStore } from "@/application/events/ports/eventStore";
import type { Event } from "@/domain/events/entities";
import type { EventStoreError, EventValidationError } from "@/domain/events/errors";
import { eventInputSchema, type EventInput } from "@/domain/events/schemas";
import { err, ok, type Result } from "@/shared/result";

import { toValidationError } from "./_validation";

export interface EditEventDeps {
  store: EventStore;
  clock: () => string;
}

export type EditEvent = (
  existing: Event,
  input: EventInput,
) => Promise<Result<Event, EventValidationError | EventStoreError>>;

export function makeEditEvent(deps: EditEventDeps): EditEvent {
  return async (existing, input) => {
    const parsed = eventInputSchema.safeParse(input);
    if (!parsed.success) return err(toValidationError(parsed.error));

    const updated: Event = {
      ...existing,
      title: parsed.data.title,
      start: parsed.data.start,
      end: parsed.data.end,
      allDay: parsed.data.allDay,
      updatedAt: deps.clock(),
    };

    const saved = await deps.store.save(updated);
    if (!saved.ok) return err(saved.error);
    return ok(updated);
  };
}
