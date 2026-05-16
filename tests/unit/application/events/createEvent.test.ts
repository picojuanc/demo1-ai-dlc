import { describe, expect, it } from "vitest";

import { makeCreateEvent } from "@/application/events/useCases/createEvent";
import type { EventInput } from "@/domain/events/schemas";

import { fakeEventStore } from "./_fakeEventStore";

const ID = "11111111-1111-4111-8111-111111111111";
const NOW = "2026-05-16T10:00";

function setup() {
  const fake = fakeEventStore();
  const createEvent = makeCreateEvent({
    store: fake.store,
    clock: () => NOW,
    newId: () => ID,
  });
  return { fake, createEvent };
}

const baseInput: EventInput = {
  title: "Reunión 1:1",
  start: "2026-05-20T09:00",
  end: "2026-05-20T10:00",
  allDay: false,
};

describe("createEvent", () => {
  // Derived from R3.1
  it("crea un evento de un día con horas y lo persiste", async () => {
    const { fake, createEvent } = setup();

    const result = await createEvent(baseInput);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({
      id: ID,
      title: "Reunión 1:1",
      start: "2026-05-20T09:00",
      end: "2026-05-20T10:00",
      allDay: false,
      status: "not-done",
      createdAt: NOW,
      updatedAt: NOW,
    });
    expect(fake.snapshot()).toHaveLength(1);
  });

  // Derived from R3.2
  it("crea un evento de un día marcado todo el día", async () => {
    const { createEvent } = setup();

    const result = await createEvent({
      title: "Cumpleaños",
      start: "2026-06-01",
      end: "2026-06-01",
      allDay: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.allDay).toBe(true);
    expect(result.value.start).toBe("2026-06-01");
  });

  // Derived from R3.3
  it("crea un evento multi-día sin horas", async () => {
    const { createEvent } = setup();

    const result = await createEvent({
      title: "Vacaciones",
      start: "2026-07-10",
      end: "2026-07-20",
      allDay: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.start).toBe("2026-07-10");
    expect(result.value.end).toBe("2026-07-20");
  });

  // Derived from R3.4
  it("crea un evento multi-día con horas", async () => {
    const { createEvent } = setup();

    const result = await createEvent({
      title: "Conferencia",
      start: "2026-08-05T08:00",
      end: "2026-08-07T18:00",
      allDay: false,
    });

    expect(result.ok).toBe(true);
  });

  // Derived from R3.5
  it("rechaza el evento si el título queda vacío tras trim", async () => {
    const { fake, createEvent } = setup();

    const result = await createEvent({ ...baseInput, title: "   " });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("validation");
    expect(fake.snapshot()).toHaveLength(0);
  });

  // Derived from R3.6
  it("rechaza el evento cuando el fin es anterior al inicio", async () => {
    const { fake, createEvent } = setup();

    const result = await createEvent({
      ...baseInput,
      start: "2026-05-20T15:00",
      end: "2026-05-20T09:00",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("validation");
    if (result.error.kind !== "validation") return;
    expect(result.error.issues.some((i) => i.path.includes("end"))).toBe(true);
    expect(fake.snapshot()).toHaveLength(0);
  });

  // Derived from R1.1
  it("propaga errores del store sin persistir nada", async () => {
    const { fake, createEvent } = setup();
    fake.forceErrorOn("save", { kind: "quotaExceeded" });

    const result = await createEvent(baseInput);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("quotaExceeded");
    expect(fake.snapshot()).toHaveLength(0);
  });
});
