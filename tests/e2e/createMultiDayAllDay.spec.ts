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
  submitCreate,
  todayKey,
} from "./_helpers";

// Derived from R3.3
test("crear evento multi-día marcado como todo el día", async ({ page }) => {
  await gotoCleanCalendar(page);

  const today = await todayKey(page);
  const endDay = addDays(today, 3);

  await selectDay(page, today);
  await openCreateDialog(page);

  await fillTitle(page, "Vacaciones");
  await setAllDay(page, true);
  await setEnd(page, endDay);

  await submitCreate(page);

  // Aparece en el panel y en cada celda del rango (R2.4 vía R3.3).
  await expect(page.getByRole("region", { name: /Eventos del/ })).toContainText("Vacaciones");
  for (let i = 0; i <= 3; i++) {
    const day = addDays(today, i);
    await expect(gridCell(page, day)).toContainText("Vacaciones");
  }
});
