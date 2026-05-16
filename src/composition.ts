import type { EventStore } from "@/application/events/ports/eventStore";
import { makeListEvents, type ListEvents } from "@/application/events/useCases/listEvents";
import {
  makeToggleEventStatus,
  type ToggleEventStatus,
} from "@/application/events/useCases/toggleEventStatus";
import { makeLocalStorageEventStore } from "@/infrastructure/storage/localStorageEventStore";

function nowIso(): string {
  // ISO local sin segundos: coincide con el formato de start/end de
  // eventos con hora (`YYYY-MM-DDTHH:mm`).
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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

export function getToggleEventStatus(): ToggleEventStatus {
  return makeToggleEventStatus({ store: getEventStore(), clock: nowIso });
}
