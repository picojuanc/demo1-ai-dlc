import { expect, test } from "@playwright/test";

import {
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

// Derived from R3.1
test("crear evento de un día con hora de inicio y fin", async ({ page }) => {
  await gotoCleanCalendar(page);

  const today = await todayKey(page);
  await selectDay(page, today);
  await openCreateDialog(page);

  await fillTitle(page, "Reunión 1:1");
  await setAllDay(page, false);

  // Los inputs cambian a `datetime-local`; el valor incluye `THH:mm`.
  await setStart(page, `${today}T09:00`);
  await setEnd(page, `${today}T10:00`);

  await submitCreate(page);

  await expect(page.getByRole("region", { name: /Eventos del/ })).toContainText("Reunión 1:1");
  await expect(page.getByText("09:00–10:00")).toBeVisible();
  await expect(gridCell(page, today)).toContainText("Reunión 1:1");
});
