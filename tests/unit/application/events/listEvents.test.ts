import { describe, expect, it } from "vitest";

import { makeListEvents } from "@/application/events/useCases/listEvents";
import type { Event } from "@/domain/events/entities";

import { fakeEventStore } from "./_fakeEventStore";

const sample: Event = {
  id: "55555555-5555-4555-8555-555555555555",
  title: "Evento 1",
  start: "2026-05-25",
  end: "2026-05-25",
  allDay: true,
  status: "not-done",
  createdAt: "2026-05-10T08:00",
  updatedAt: "2026-05-10T08:00",
};

describe("listEvents", () => {
  // Derived from R1.2
  it("retorna lista vacía cuando el store no tiene datos", async () => {
    const fake = fakeEventStore();
    const listEvents = makeListEvents({ store: fake.store });

    const result = await listEvents();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([]);
  });

  // Derived from R1.2
  it("retorna los eventos cargados desde el store", async () => {
    const fake = fakeEventStore();
    fake.seed([sample]);
    const listEvents = makeListEvents({ store: fake.store });

    const result = await listEvents();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([sample]);
  });

  // Derived from R1.2
  it("propaga errores del store (p.ej. corruptedStorage)", async () => {
    const fake = fakeEventStore();
    fake.forceErrorOn("list", { kind: "corruptedStorage" });
    const listEvents = makeListEvents({ store: fake.store });

    const result = await listEvents();

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("corruptedStorage");
  });
});
