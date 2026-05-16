import { describe, expect, it } from "vitest";

import { makeDeleteEvent } from "@/application/events/useCases/deleteEvent";
import type { Event } from "@/domain/events/entities";

import { fakeEventStore } from "./_fakeEventStore";

const seeded: Event = {
  id: "33333333-3333-4333-8333-333333333333",
  title: "Tarea a borrar",
  start: "2026-05-25",
  end: "2026-05-25",
  allDay: true,
  status: "not-done",
  createdAt: "2026-05-10T08:00",
  updatedAt: "2026-05-10T08:00",
};

function setup() {
  const fake = fakeEventStore();
  fake.seed([seeded]);
  const deleteEvent = makeDeleteEvent({ store: fake.store });
  return { fake, deleteEvent };
}

describe("deleteEvent", () => {
  // Derived from R4.2
  it("borra un evento existente del store", async () => {
    const { fake, deleteEvent } = setup();

    const result = await deleteEvent(seeded.id);

    expect(result.ok).toBe(true);
    expect(fake.snapshot()).toHaveLength(0);
  });

  // Derived from R4.2
  it("retorna notFound cuando el id no existe", async () => {
    const { fake, deleteEvent } = setup();

    const result = await deleteEvent("00000000-0000-4000-8000-000000000000");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("notFound");
    expect(fake.snapshot()).toHaveLength(1);
  });
});
