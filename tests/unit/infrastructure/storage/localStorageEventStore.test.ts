import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { makeLocalStorageEventStore } from "@/infrastructure/storage/localStorageEventStore";
import type { Event } from "@/domain/events/entities";

const STORAGE_KEY = "dad_events_v1";

const sample: Event = {
  id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  title: "Sample",
  start: "2026-06-01T10:00",
  end: "2026-06-01T11:00",
  allDay: false,
  status: "not-done",
  createdAt: "2026-05-16T08:00",
  updatedAt: "2026-05-16T08:00",
};

describe("localStorageEventStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  // Derived from R1.2
  it("list retorna lista vacía cuando la key no existe", async () => {
    const store = makeLocalStorageEventStore({ storage: window.localStorage });

    const result = await store.list();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([]);
  });

  // Derived from R1.2
  it("list retorna los eventos persistidos", async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, events: [sample] }));
    const store = makeLocalStorageEventStore({ storage: window.localStorage });

    const result = await store.list();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([sample]);
  });

  // Derived from R1.3
  it("list retorna corruptedStorage cuando el JSON es inválido", async () => {
    window.localStorage.setItem(STORAGE_KEY, "{not-json");
    const store = makeLocalStorageEventStore({ storage: window.localStorage });

    const result = await store.list();

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("corruptedStorage");
    // R1.3 — no se sobrescribe lo guardado.
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("{not-json");
  });

  // Derived from R1.3
  it("list retorna schemaUnknown cuando la versión es distinta de 1", async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, events: [] }));
    const store = makeLocalStorageEventStore({ storage: window.localStorage });

    const result = await store.list();

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("schemaUnknown");
    if (result.error.kind !== "schemaUnknown") return;
    expect(result.error.got).toBe(2);
    // R1.3 — no se sobrescribe lo guardado.
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toEqual({
      version: 2,
      events: [],
    });
  });

  // Derived from R1.3
  it("list retorna corruptedStorage cuando faltan campos obligatorios", async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, events: [{ id: "x" }] }));
    const store = makeLocalStorageEventStore({ storage: window.localStorage });

    const result = await store.list();

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("corruptedStorage");
  });

  // Derived from R1.1
  it("save persiste un evento nuevo en localStorage", async () => {
    const store = makeLocalStorageEventStore({ storage: window.localStorage });

    const result = await store.save(sample);

    expect(result.ok).toBe(true);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual({ version: 1, events: [sample] });
  });

  // Derived from R1.1
  it("save actúa como upsert sobre id existente", async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, events: [sample] }));
    const store = makeLocalStorageEventStore({ storage: window.localStorage });

    const updated: Event = { ...sample, title: "Sample renombrado" };
    const result = await store.save(updated);

    expect(result.ok).toBe(true);
    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(persisted.events).toHaveLength(1);
    expect(persisted.events[0].title).toBe("Sample renombrado");
  });

  // Derived from R1.1
  it("save retorna quotaExceeded cuando setItem lanza QuotaExceededError", async () => {
    const fakeStorage: Storage = {
      length: 0,
      clear: () => {},
      getItem: () => null,
      key: () => null,
      removeItem: () => {},
      setItem: () => {
        throw new DOMException("quota", "QuotaExceededError");
      },
    };
    const store = makeLocalStorageEventStore({ storage: fakeStorage });

    const result = await store.save(sample);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("quotaExceeded");
  });

  // Derived from R1.1
  it("save retorna unavailable ante errores de escritura no-quota", async () => {
    const fakeStorage: Storage = {
      length: 0,
      clear: () => {},
      getItem: () => null,
      key: () => null,
      removeItem: () => {},
      setItem: () => {
        throw new Error("disk gone");
      },
    };
    const store = makeLocalStorageEventStore({ storage: fakeStorage });

    const result = await store.save(sample);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("unavailable");
  });

  // Derived from R1.1
  it("save propaga error de read (corruptedStorage) sin escribir", async () => {
    window.localStorage.setItem(STORAGE_KEY, "{broken");
    const setSpy = vi.spyOn(Storage.prototype, "setItem");
    const store = makeLocalStorageEventStore({ storage: window.localStorage });

    const result = await store.save(sample);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("corruptedStorage");
    // setItem nunca se llama tras un read fallido.
    expect(setSpy).not.toHaveBeenCalled();
  });

  // Derived from R4.2
  it("delete elimina el evento del storage", async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, events: [sample] }));
    const store = makeLocalStorageEventStore({ storage: window.localStorage });

    const result = await store.delete(sample.id);

    expect(result.ok).toBe(true);
    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(persisted.events).toEqual([]);
  });

  // Derived from R4.2
  it("delete retorna notFound cuando el id no existe", async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, events: [sample] }));
    const store = makeLocalStorageEventStore({ storage: window.localStorage });

    const result = await store.delete("00000000-0000-4000-8000-000000000000");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("notFound");
    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(persisted.events).toEqual([sample]);
  });
});
