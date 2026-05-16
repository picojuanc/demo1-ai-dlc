import { expect, test } from "@playwright/test";

import {
  fillTitle,
  gotoCleanCalendar,
  gridCell,
  openCreateDialog,
  selectDay,
  setAllDay,
  submitCreate,
  todayKey,
} from "./_helpers";

// Derived from R3.2
test("crear evento de un día marcado como todo el día", async ({ page }) => {
  await gotoCleanCalendar(page);

  const today = await todayKey(page);
  await selectDay(page, today);
  await openCreateDialog(page);

  await fillTitle(page, "Cumpleaños de María");
  // Para creación, el default es allDay=true (R3.2).
  await setAllDay(page, true);

  await submitCreate(page);

  // El evento aparece en el panel del día y en la celda del grid.
  await expect(page.getByRole("region", { name: /Eventos del/ })).toContainText(
    "Cumpleaños de María",
  );
  await expect(page.getByText("Todo el día").first()).toBeVisible();
  await expect(gridCell(page, today)).toContainText("Cumpleaños de María");
});
