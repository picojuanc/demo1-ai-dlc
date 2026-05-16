import { describe, expect, it } from "vitest";
import { eventsInRange } from "@/domain/events/helpers";
import type { Event } from "@/domain/events/schemas";

const e = (start: string, end: string, id: string): Event => ({
  id,
  title: id,
  start,
  end,
  allDay: !start.includes("T"),
  status: "not-done",
  createdAt: "2026-05-16T08:00",
  updatedAt: "2026-05-16T08:00",
});

describe("eventsInRange", () => {
  // Derived from R2.1
  it("incluye eventos completamente dentro del rango", () => {
    const events = [e("2026-05-10T10:00", "2026-05-10T11:00", "in")];
    expect(eventsInRange(events, "2026-05-01", "2026-05-31").map((x) => x.id)).toEqual(["in"]);
  });

  // Derived from R2.1
  it("incluye eventos que solapan el inicio del rango", () => {
    const events = [e("2026-04-28", "2026-05-02", "overlap-start")];
    expect(eventsInRange(events, "2026-05-01", "2026-05-31").map((x) => x.id)).toEqual([
      "overlap-start",
    ]);
  });

  // Derived from R2.1
  it("incluye eventos que solapan el fin del rango", () => {
    const events = [e("2026-05-30", "2026-06-02", "overlap-end")];
    expect(eventsInRange(events, "2026-05-01", "2026-05-31").map((x) => x.id)).toEqual([
      "overlap-end",
    ]);
  });

  // Derived from R2.1
  it("excluye eventos completamente antes del rango", () => {
    const events = [e("2026-04-01", "2026-04-30", "before")];
    expect(eventsInRange(events, "2026-05-01", "2026-05-31")).toHaveLength(0);
  });

  // Derived from R2.1
  it("excluye eventos completamente después del rango", () => {
    const events = [e("2026-06-01", "2026-06-30", "after")];
    expect(eventsInRange(events, "2026-05-01", "2026-05-31")).toHaveLength(0);
  });

  // Derived from R2.1
  it("incluye eventos cuyo rango contiene al rango buscado", () => {
    const events = [e("2026-04-01", "2026-12-31", "long")];
    expect(eventsInRange(events, "2026-05-01", "2026-05-31").map((x) => x.id)).toEqual(["long"]);
  });
});
