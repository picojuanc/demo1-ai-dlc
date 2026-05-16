import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { makeLocalStorageEventStore } from "@/infrastructure/storage/localStorageEventStore";
import type { Event } from "@/domain/events/entities";

const events: Event[] = [
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    title: "Evento 1",
    start: "2026-06-01T09:00",
    end: "2026-06-01T10:00",
    allDay: false,
    status: "not-done",
    createdAt: "2026-05-16T08:00",
    updatedAt: "2026-05-16T08:00",
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    title: "Vacaciones",
    start: "2026-07-10",
    end: "2026-07-20",
    allDay: true,
    status: "not-done",
    createdAt: "2026-05-16T08:01",
    updatedAt: "2026-05-16T08:01",
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    title: "Cumpleaños",
    start: "2026-08-15",
    end: "2026-08-15",
    allDay: true,
    status: "done",
    createdAt: "2026-05-16T08:02",
    updatedAt: "2026-05-16T08:02",
  },
];

describe("persistence — round-trip localStorageEventStore", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  // Derived from R1.1
  // Derived from R1.2
  it("escribe múltiples eventos y los recupera intactos en una nueva instancia", async () => {
    const writer = makeLocalStorageEventStore({ storage: window.localStorage });

    for (const e of events) {
      const r = await writer.save(e);
      expect(r.ok).toBe(true);
    }

    // Nueva instancia para forzar lectura desde storage (no caché en memoria).
    const reader = makeLocalStorageEventStore({ storage: window.localStorage });
    const result = await reader.list();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toHaveLength(3);
    // Orden de inserción preservado.
    expect(result.value.map((e) => e.id)).toEqual(events.map((e) => e.id));
    // Cada evento idéntico al original.
    for (const original of events) {
      expect(result.value.find((e) => e.id === original.id)).toEqual(original);
    }
  });

  // Derived from R1.1
  it("edita un evento existente y la nueva instancia ve la versión actualizada", async () => {
    const first = makeLocalStorageEventStore({ storage: window.localStorage });
    await first.save(events[0]!);
    await first.save({ ...events[0]!, title: "Editado" });

    const second = makeLocalStorageEventStore({ storage: window.localStorage });
    const result = await second.list();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toHaveLength(1);
    expect(result.value[0]?.title).toBe("Editado");
  });

  // Derived from R1.2
  it("una nueva instancia con localStorage vacío reporta lista vacía sin errores", async () => {
    const store = makeLocalStorageEventStore({ storage: window.localStorage });
    const result = await store.list();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([]);
  });
});
