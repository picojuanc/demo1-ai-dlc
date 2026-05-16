import { eachDayOfInterval, format, parseISO } from "date-fns";
import type { Event } from "./schemas";
import type { EventKind } from "./valueObjects";

// Helpers puros del dominio. Operan sobre strings de fecha locales
// `YYYY-MM-DD` o `YYYY-MM-DDTHH:mm`. Sin Date salvo para iteración
// de rango (date-fns).

const dayPart = (iso: string): string => iso.slice(0, 10);

const sameDay = (a: string, b: string): boolean => dayPart(a) === dayPart(b);

// R3.1–R3.4 — clasifica un evento en uno de los 4 tipos.
export function eventKind(e: Event): EventKind {
  const same = sameDay(e.start, e.end);
  if (e.allDay && same) return "single-day-allday";
  if (e.allDay && !same) return "multi-day-allday";
  if (!e.allDay && same) return "single-day-timed";
  return "multi-day-timed";
}

// R2.4 — ¿el evento ocupa el día `day` (formato YYYY-MM-DD)?
export function eventInDay(e: Event, day: string): boolean {
  const startDay = dayPart(e.start);
  const endDay = dayPart(e.end);
  return day >= startDay && day <= endDay;
}

// R2.1 — eventos cuyo rango intersecta `[rangeStart, rangeEnd]` (inclusive).
export function eventsInRange(events: Event[], rangeStart: string, rangeEnd: string): Event[] {
  return events.filter((e) => {
    const eStart = dayPart(e.start);
    const eEnd = dayPart(e.end);
    return eEnd >= rangeStart && eStart <= rangeEnd;
  });
}

// R2.4 — lista todos los días YYYY-MM-DD que el evento atraviesa.
export function eventDays(e: Event): string[] {
  const startDay = parseISO(`${dayPart(e.start)}T00:00:00`);
  const endDay = parseISO(`${dayPart(e.end)}T00:00:00`);
  return eachDayOfInterval({ start: startDay, end: endDay }).map((d) => format(d, "yyyy-MM-dd"));
}
