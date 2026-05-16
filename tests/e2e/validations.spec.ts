import { expect, test } from "@playwright/test";

import {
  addDays,
  gotoCleanCalendar,
  openCreateDialog,
  selectDay,
  setEnd,
  setStart,
  todayKey,
} from "./_helpers";

test.describe("validaciones del formulario", () => {
  // Derived from R3.5
  test("título vacío deshabilita submit y muestra mensaje en español", async ({ page }) => {
    await gotoCleanCalendar(page);
    const today = await todayKey(page);
    await selectDay(page, today);
    await openCreateDialog(page);

    const submit = page.getByRole("button", { name: "Crear evento" });
    await expect(submit).toBeDisabled();

    // Disparar la validación: typear y borrar para que onChange detecte vacío.
    const title = page.getByLabel("Título");
    await title.fill("temporal");
    await title.fill("");

    await expect(page.getByText("El título es obligatorio")).toBeVisible();
    await expect(submit).toBeDisabled();
  });

  // Derived from R3.5
  test("título de sólo espacios también es rechazado", async ({ page }) => {
    await gotoCleanCalendar(page);
    const today = await todayKey(page);
    await selectDay(page, today);
    await openCreateDialog(page);

    await page.getByLabel("Título").fill("   ");

    await expect(page.getByText("El título es obligatorio")).toBeVisible();
    await expect(page.getByRole("button", { name: "Crear evento" })).toBeDisabled();
  });

  // Derived from R3.6
  test("fin anterior al inicio muestra mensaje y deshabilita submit", async ({ page }) => {
    await gotoCleanCalendar(page);
    const today = await todayKey(page);
    const future = addDays(today, 5);
    await selectDay(page, today);
    await openCreateDialog(page);

    await page.getByLabel("Título").fill("Evento inválido");
    // En modo allDay (default): start y end son `YYYY-MM-DD`, ambos
    // arrancan en `today`. Mover start al futuro deja end < start.
    await setStart(page, future);

    await expect(page.getByText("El fin no puede ser anterior al inicio")).toBeVisible();
    await expect(page.getByRole("button", { name: "Crear evento" })).toBeDisabled();

    // Corrigiendo el fin, el submit se habilita.
    await setEnd(page, future);
    await expect(page.getByText("El fin no puede ser anterior al inicio")).toBeHidden();
    await expect(page.getByRole("button", { name: "Crear evento" })).toBeEnabled();
  });
});
