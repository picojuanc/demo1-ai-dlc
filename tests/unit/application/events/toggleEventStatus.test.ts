import { describe, expect, it } from "vitest";

import { makeToggleEventStatus } from "@/application/events/useCases/toggleEventStatus";
import type { Event } from "@/domain/events/entities";

import { fakeEventStore } from "./_fakeEventStore";

const NOW = "2026-05-17T15:00";

const baseEvent: Event = {
  id: "44444444-4444-4444-8444-444444444444",
  title: "Tarea togglable",
  start: "2026-05-25",
  end: "2026-05-25",
  allDay: true,
  status: "not-done",
  createdAt: "2026-05-10T08:00",
  updatedAt: "2026-05-10T08:00",
};

function setup(seed: Event = baseEvent) {
  const fake = fakeEventStore();
  fake.seed([seed]);
  const toggle = makeToggleEventStatus({
    store: fake.store,
    clock: () => NOW,
  });
  return { fake, toggle };
}

describe("toggleEventStatus", () => {
  // Derived from R4.3
  it("alterna de not-done a done y actualiza updatedAt", async () => {
    const { fake, toggle } = setup();

    const result = await toggle(baseEvent);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("done");
    expect(result.value.updatedAt).toBe(NOW);
    expect(fake.snapshot()[0]?.status).toBe("done");
  });

  // Derived from R4.3
  it("alterna de done a not-done", async () => {
    const { fake, toggle } = setup({ ...baseEvent, status: "done" });

    const result = await toggle({ ...baseEvent, status: "done" });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("not-done");
    expect(fake.snapshot()[0]?.status).toBe("not-done");
  });

  // Derived from R4.3
  it("propaga errores del store sin alterar el evento", async () => {
    const { fake, toggle } = setup();
    fake.forceErrorOn("save", { kind: "quotaExceeded" });

    const result = await toggle(baseEvent);

    expect(result.ok).toBe(false);
    expect(fake.snapshot()[0]?.status).toBe("not-done");
  });
});
