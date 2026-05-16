import { describe, expect, it } from "vitest";

import { makeEditEvent } from "@/application/events/useCases/editEvent";
import type { Event } from "@/domain/events/entities";
import type { EventInput } from "@/domain/events/schemas";

import { fakeEventStore } from "./_fakeEventStore";

const NOW = "2026-05-17T12:30";

const existing: Event = {
  id: "22222222-2222-4222-8222-222222222222",
  title: "Reunión original",
  start: "2026-05-20T09:00",
  end: "2026-05-20T10:00",
  allDay: false,
  status: "done",
  createdAt: "2026-05-10T08:00",
  updatedAt: "2026-05-10T08:00",
};

function setup() {
  const fake = fakeEventStore();
  fake.seed([existing]);
  const editEvent = makeEditEvent({ store: fake.store, clock: () => NOW });
  return { fake, editEvent };
}

describe("editEvent", () => {
  // Derived from R4.1
  it("aplica los cambios y preserva id, createdAt y status", async () => {
    const { fake, editEvent } = setup();

    const input: EventInput = {
      title: "Reunión renombrada",
      start: "2026-05-21T11:00",
      end: "2026-05-21T12:00",
      allDay: false,
    };
    const result = await editEvent(existing, input);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({
      ...existing,
      title: "Reunión renombrada",
      start: "2026-05-21T11:00",
      end: "2026-05-21T12:00",
      updatedAt: NOW,
    });
    expect(fake.snapshot()).toHaveLength(1);
    expect(fake.snapshot()[0]?.title).toBe("Reunión renombrada");
  });

  // Derived from R3.5
  it("aplica R3.5 en edición: rechaza título vacío", async () => {
    const { fake, editEvent } = setup();

    const result = await editEvent(existing, {
      title: "  ",
      start: existing.start,
      end: existing.end,
      allDay: false,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("validation");
    expect(fake.snapshot()[0]?.title).toBe("Reunión original");
  });

  // Derived from R3.6
  it("aplica R3.6 en edición: rechaza fin anterior al inicio", async () => {
    const { editEvent } = setup();

    const result = await editEvent(existing, {
      title: "Reunión",
      start: "2026-05-20T15:00",
      end: "2026-05-20T09:00",
      allDay: false,
    });

    expect(result.ok).toBe(false);
  });

  // Derived from R4.1
  it("propaga errores del store sin alterar el evento original", async () => {
    const { fake, editEvent } = setup();
    fake.forceErrorOn("save", { kind: "quotaExceeded" });

    const result = await editEvent(existing, {
      title: "Reunión modificada",
      start: "2026-05-21T11:00",
      end: "2026-05-21T12:00",
      allDay: false,
    });

    expect(result.ok).toBe(false);
    expect(fake.snapshot()[0]?.title).toBe("Reunión original");
  });
});
