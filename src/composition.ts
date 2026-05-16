import type { EventStore } from "@/application/events/ports/eventStore";
import { makeLocalStorageEventStore } from "@/infrastructure/storage/localStorageEventStore";

// Composition root: única ubicación donde se construye el grafo de
// dependencias del lado cliente. Llamar sólo desde componentes 'use
// client' (R1.4 — `window.localStorage` no existe en server).

let cached: EventStore | null = null;

export function getEventStore(): EventStore {
  if (cached) return cached;
  if (typeof window === "undefined") {
    throw new Error("getEventStore() must be called on the client");
  }
  cached = makeLocalStorageEventStore({ storage: window.localStorage });
  return cached;
}
