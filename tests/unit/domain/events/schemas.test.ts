import { describe, expect, it } from "vitest";
import { eventSchema, persistedSchema } from "@/domain/events/schemas";

const validEvent = {
  id: "11111111-1111-1111-1111-111111111111",
  title: "Comprar pan",
  start: "2026-05-16T10:00",
  end: "2026-05-16T11:00",
  allDay: false,
  status: "not-done" as const,
  createdAt: "2026-05-16T08:00",
  updatedAt: "2026-05-16T08:00",
};

describe("eventSchema", () => {
  // Derived from R3.5
  it("rechaza título vacío con mensaje en español", () => {
    const r = eventSchema.safeParse({ ...validEvent, title: "" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const titleIssue = r.error.issues.find((i) => i.path[0] === "title");
      expect(titleIssue?.message).toBe("El título es obligatorio");
    }
  });

  // Derived from R3.5
  it("rechaza título compuesto solo por espacios", () => {
    const r = eventSchema.safeParse({ ...validEvent, title: "   " });
    expect(r.success).toBe(false);
  });

  // Derived from R3.6
  it("rechaza fin anterior al inicio en evento timed", () => {
    const r = eventSchema.safeParse({ ...validEvent, end: "2026-05-16T09:00" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const endIssue = r.error.issues.find(
        (i) => i.path[0] === "end" && i.message === "El fin no puede ser anterior al inicio",
      );
      expect(endIssue).toBeDefined();
    }
  });

  // Derived from R3.6
  it("rechaza fin anterior al inicio en evento multi-día allDay", () => {
    const r = eventSchema.safeParse({
      ...validEvent,
      allDay: true,
      start: "2026-05-20",
      end: "2026-05-15",
    });
    expect(r.success).toBe(false);
  });

  it("acepta un evento timed válido", () => {
    expect(eventSchema.safeParse(validEvent).success).toBe(true);
  });

  it("acepta un evento allDay single-day (start === end)", () => {
    expect(
      eventSchema.safeParse({
        ...validEvent,
        allDay: true,
        start: "2026-05-16",
        end: "2026-05-16",
      }).success,
    ).toBe(true);
  });

  it("rechaza formato con horas cuando allDay=true", () => {
    const r = eventSchema.safeParse({
      ...validEvent,
      allDay: true,
      start: "2026-05-16T10:00",
      end: "2026-05-16T11:00",
    });
    expect(r.success).toBe(false);
  });

  it("rechaza formato sin horas cuando allDay=false", () => {
    const r = eventSchema.safeParse({
      ...validEvent,
      allDay: false,
      start: "2026-05-16",
      end: "2026-05-16",
    });
    expect(r.success).toBe(false);
  });
});

describe("persistedSchema", () => {
  // Derived from R1.3
  it("acepta version 1 con lista vacía", () => {
    expect(persistedSchema.safeParse({ version: 1, events: [] }).success).toBe(true);
  });

  // Derived from R1.3
  it("rechaza version distinta de 1", () => {
    expect(persistedSchema.safeParse({ version: 2, events: [] }).success).toBe(false);
    expect(persistedSchema.safeParse({ version: 0, events: [] }).success).toBe(false);
  });

  // Derived from R1.3
  it("rechaza ausencia del campo version", () => {
    expect(persistedSchema.safeParse({ events: [] }).success).toBe(false);
  });

  // Derived from R1.3
  it("rechaza un payload completamente distinto al schema (no sobrescribe)", () => {
    expect(persistedSchema.safeParse({ foo: "bar" }).success).toBe(false);
  });
});
