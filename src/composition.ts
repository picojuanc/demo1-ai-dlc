import type { EventStore } from "@/application/events/ports/eventStore";
import { makeListEvents, type ListEvents } from "@/application/events/useCases/listEvents";
import { makeLocalStorageEventStore } from "@/infrastructure/storage/localStorageEventStore";

// Composition root: única ubicación donde se construye el grafo de
// dependencias del lado cliente. Llamar sólo desde componentes 'use
// client' (R1.4 — `window.localStorage` no existe en server).

let cachedStore: EventStore | null = null;

export function getEventStore(): EventStore {
  if (cachedStore) return cachedStore;
  if (typeof window === "undefined") {
    throw new Error("getEventStore() must be called on the client");
  }
  cachedStore = makeLocalStorageEventStore({ storage: window.localStorage });
  return cachedStore;
}

export function getListEvents(): ListEvents {
  return makeListEvents({ store: getEventStore() });
}
