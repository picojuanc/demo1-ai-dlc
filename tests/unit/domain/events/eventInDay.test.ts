import { describe, expect, it } from "vitest";
import { eventDays, eventInDay } from "@/domain/events/helpers";
import type { Event } from "@/domain/events/schemas";

const e = (start: string, end: string, allDay = false): Event => ({
  id: "11111111-1111-1111-1111-111111111111",
  title: "x",
  start,
  end,
  allDay,
  status: "not-done",
  createdAt: "2026-05-16T08:00",
  updatedAt: "2026-05-16T08:00",
});

describe("eventInDay", () => {
  // Derived from R2.4
  it("retorna true para un single-day en su día", () => {
    expect(eventInDay(e("2026-05-16T10:00", "2026-05-16T11:00"), "2026-05-16")).toBe(true);
  });

  // Derived from R2.4
  it("retorna false fuera del día", () => {
    expect(eventInDay(e("2026-05-16T10:00", "2026-05-16T11:00"), "2026-05-17")).toBe(false);
  });

  // Derived from R2.4
  it("retorna true en cualquier día interior de un evento multi-día", () => {
    const ev = e("2026-05-16", "2026-05-19", true);
    expect(eventInDay(ev, "2026-05-16")).toBe(true);
    expect(eventInDay(ev, "2026-05-17")).toBe(true);
    expect(eventInDay(ev, "2026-05-18")).toBe(true);
    expect(eventInDay(ev, "2026-05-19")).toBe(true);
  });

  // Derived from R2.4
  it("retorna false un día antes y un día después del rango", () => {
    const ev = e("2026-05-16", "2026-05-19", true);
    expect(eventInDay(ev, "2026-05-15")).toBe(false);
    expect(eventInDay(ev, "2026-05-20")).toBe(false);
  });
});

describe("eventDays", () => {
  // Derived from R2.4
  it("enumera todos los días que abarca un evento multi-día", () => {
    expect(eventDays(e("2026-05-16", "2026-05-19", true))).toEqual([
      "2026-05-16",
      "2026-05-17",
      "2026-05-18",
      "2026-05-19",
    ]);
  });

  // Derived from R2.4
  it("retorna un solo día para evento single-day", () => {
    expect(eventDays(e("2026-05-16T10:00", "2026-05-16T11:00"))).toEqual(["2026-05-16"]);
  });

  // Derived from R2.4
  it("enumera correctamente eventos multi-día con horas distintas", () => {
    expect(eventDays(e("2026-05-30T22:00", "2026-06-01T03:00"))).toEqual([
      "2026-05-30",
      "2026-05-31",
      "2026-06-01",
    ]);
  });
});
