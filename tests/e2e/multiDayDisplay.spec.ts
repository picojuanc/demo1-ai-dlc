import { expect, test } from "@playwright/test";

import { addDays, gotoCleanCalendar, gridCell, todayKey, type SeedEvent } from "./_helpers";

function todayKeyNode(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

test.describe("eventos multi-día", () => {
  // Derived from R2.4
  test("evento multi-día aparece en cada celda del rango visible", async ({ page }) => {
    const today = todayKeyNode();
    const end = addDays(today, 4);

    const seed: SeedEvent[] = [
      {
        id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
        title: "Vacaciones",
        start: today,
        end,
        allDay: true,
        status: "not-done",
        createdAt: `${today}T08:00`,
        updatedAt: `${today}T08:00`,
      },
    ];

    await gotoCleanCalendar(page, seed);
    const todayUI = await todayKey(page);

    for (let i = 0; i <= 4; i++) {
      const day = addDays(todayUI, i);
      await expect(gridCell(page, day)).toContainText("Vacaciones");
    }
  });

  // Derived from R2.4
  test("celdas fuera del rango no muestran el evento", async ({ page }) => {
    const today = todayKeyNode();
    const seed: SeedEvent[] = [
      {
        id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
        title: "Vacaciones",
        start: today,
        end: addDays(today, 2),
        allDay: true,
        status: "not-done",
        createdAt: `${today}T08:00`,
        updatedAt: `${today}T08:00`,
      },
    ];

    await gotoCleanCalendar(page, seed);
    const todayUI = await todayKey(page);

    // Día anterior al inicio: no debe contener el evento.
    const beforeStart = addDays(todayUI, -1);
    await expect(gridCell(page, beforeStart)).not.toContainText("Vacaciones");

    // Día posterior al fin: no debe contener el evento.
    const afterEnd = addDays(todayUI, 3);
    await expect(gridCell(page, afterEnd)).not.toContainText("Vacaciones");
  });
});
