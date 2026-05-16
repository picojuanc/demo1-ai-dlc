import { expect, test } from "@playwright/test";

import {
  addDays,
  fillTitle,
  gotoCleanCalendar,
  gridCell,
  openCreateDialog,
  selectDay,
  setAllDay,
  setEnd,
  setStart,
  submitCreate,
  todayKey,
} from "./_helpers";

// Derived from R3.4
test("crear evento multi-día con horas específicas", async ({ page }) => {
  await gotoCleanCalendar(page);

  const today = await todayKey(page);
  const endDay = addDays(today, 2);

  await selectDay(page, today);
  await openCreateDialog(page);

  await fillTitle(page, "Conferencia anual");
  await setAllDay(page, false);
  await setStart(page, `${today}T08:00`);
  await setEnd(page, `${endDay}T18:00`);

  await submitCreate(page);

  await expect(page.getByRole("region", { name: /Eventos del/ })).toContainText(
    "Conferencia anual",
  );
  // Evento visible en cada día del rango (R2.4).
  for (let i = 0; i <= 2; i++) {
    const day = addDays(today, i);
    await expect(gridCell(page, day)).toContainText("Conferencia anual");
  }
});
