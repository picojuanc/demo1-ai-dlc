import { expect, test } from "@playwright/test";
import { addMonths, format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";

import { gotoCleanCalendar, todayKey } from "./_helpers";

function monthTitle(d: Date): string {
  const raw = format(d, "LLLL yyyy", { locale: es });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

test.describe("navegación mensual", () => {
  // Derived from R2.1
  test("la vista por defecto es el mes actual con hoy resaltado", async ({ page }) => {
    await gotoCleanCalendar(page);

    const today = new Date();
    const expected = monthTitle(today);

    await expect(page.getByRole("heading", { level: 1, name: expected })).toBeVisible();
    // El grid usa el nombre del mes en minúsculas dentro de su aria-label.
    await expect(page.getByRole("grid", { name: new RegExp(expected, "i") })).toBeVisible();

    // R2.1 implícita: la celda de hoy existe y tiene aria-current=date.
    const todayUI = await todayKey(page);
    await expect(page.locator(`[data-day="${todayUI}"][aria-current="date"]`)).toBeVisible();
  });

  // Derived from R2.3
  test("botones prev/next/Hoy navegan entre meses", async ({ page }) => {
    await gotoCleanCalendar(page);

    const today = new Date();
    const current = monthTitle(startOfMonth(today));
    const next = monthTitle(addMonths(today, 1));
    const prev = monthTitle(addMonths(today, -1));

    await expect(page.getByRole("heading", { level: 1, name: current })).toBeVisible();

    await page.getByRole("button", { name: "Mes siguiente" }).click();
    await expect(page.getByRole("heading", { level: 1, name: next })).toBeVisible();

    // Dos atrás: regresa al actual, luego al anterior.
    await page.getByRole("button", { name: "Mes anterior" }).click();
    await page.getByRole("button", { name: "Mes anterior" }).click();
    await expect(page.getByRole("heading", { level: 1, name: prev })).toBeVisible();

    await page.getByRole("button", { name: "Hoy" }).click();
    await expect(page.getByRole("heading", { level: 1, name: current })).toBeVisible();
  });

  // Derived from R2.3 / R5.2
  test("navegación entre meses operable por teclado (PageDown/PageUp)", async ({ page }) => {
    await gotoCleanCalendar(page);

    const today = new Date();
    const next = monthTitle(addMonths(today, 1));
    const prev = monthTitle(addMonths(today, -1));
    const current = monthTitle(startOfMonth(today));

    // Foco en la celda de hoy.
    await page.locator('[aria-current="date"]').focus();

    await page.keyboard.press("PageDown");
    await expect(page.getByRole("heading", { level: 1, name: next })).toBeVisible();

    await page.keyboard.press("PageUp");
    await page.keyboard.press("PageUp");
    await expect(page.getByRole("heading", { level: 1, name: prev })).toBeVisible();

    // Volver al actual con el botón Hoy (también operable por teclado).
    await page.getByRole("button", { name: "Hoy" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1, name: current })).toBeVisible();
  });
});
