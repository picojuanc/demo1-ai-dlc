// Tipos primitivos del bounded context events.
// El shape completo de `Event` se re-exporta desde schemas.ts
// (la fuente de verdad son los schemas Zod).

export type EventId = string;
export type EventStatus = "done" | "not-done";

export type { Event, EventInput } from "./schemas";
