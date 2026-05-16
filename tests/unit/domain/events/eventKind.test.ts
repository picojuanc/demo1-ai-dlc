import { describe, expect, it } from "vitest";
import { eventKind } from "@/domain/events/helpers";
import type { Event } from "@/domain/events/schemas";

const base = (overrides: Partial<Event>): Event => ({
  id: "11111111-1111-1111-1111-111111111111",
  title: "x",
  start: "2026-05-16T10:00",
  end: "2026-05-16T11:00",
  allDay: false,
  status: "not-done",
  createdAt: "2026-05-16T08:00",
  updatedAt: "2026-05-16T08:00",
  ...overrides,
});

describe("eventKind", () => {
  // Derived from R3.1
  it("clasifica evento de un día con horas como single-day-timed", () => {
    expect(eventKind(base({}))).toBe("single-day-timed");
  });

  // Derived from R3.2
  it("clasifica evento de un día completo como single-day-allday", () => {
    expect(eventKind(base({ allDay: true, start: "2026-05-16", end: "2026-05-16" }))).toBe(
      "single-day-allday",
    );
  });

  // Derived from R3.3
  it("clasifica evento multi-día completo como multi-day-allday", () => {
    expect(eventKind(base({ allDay: true, start: "2026-05-16", end: "2026-05-18" }))).toBe(
      "multi-day-allday",
    );
  });

  // Derived from R3.4
  it("clasifica evento multi-día con horas como multi-day-timed", () => {
    expect(eventKind(base({ start: "2026-05-16T10:00", end: "2026-05-18T15:00" }))).toBe(
      "multi-day-timed",
    );
  });
});
