import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { gotoCleanCalendar, todayKey, type SeedEvent } from "./_helpers";

// Concentra los tests transversales de R5.1 (WCAG AA vía axe-core) y
// R5.2 (operabilidad sólo con teclado). El resto de specs ya ejercitan
// flechas/Enter; aquí cerramos los flujos completos sin mouse.

function todayKeyNode(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function expectNoAxeViolations(page: Page, scope?: string): Promise<void> {
  const builder = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);
  if (scope) builder.include(scope);
  const results = await builder.analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

const seed: SeedEvent[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Evento de prueba",
    start: "PLACEHOLDER",
    end: "PLACEHOLDER",
    allDay: true,
    status: "not-done",
    createdAt: "2026-05-16T08:00",
    updatedAt: "2026-05-16T08:00",
  },
];

function seedForToday(today: string): SeedEvent[] {
  return seed.map((e) => ({ ...e, start: today, end: today }));
}

test.describe("accessibility — axe-core + teclado puro", () => {
  // Derived from R5.1
  test("axe: vista del calendario vacía no tiene violaciones WCAG AA", async ({ page }) => {
    await gotoCleanCalendar(page);
    await expectNoAxeViolations(page);
  });

  // Derived from R5.1
  test("axe: vista con eventos y día seleccionado no tiene violaciones", async ({ page }) => {
    const today = todayKeyNode();
    await gotoCleanCalendar(page, seedForToday(today));
    const todayUI = await todayKey(page);
    await page.locator(`[data-day="${todayUI}"]`).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("region", { name: /Eventos del/ })).toBeVisible();
    await expectNoAxeViolations(page);
  });

  // Derived from R5.1
  test("axe: diálogo de creación abierto no tiene violaciones", async ({ page }) => {
    const today = todayKeyNode();
    await gotoCleanCalendar(page, seedForToday(today));
    const todayUI = await todayKey(page);
    await page.locator(`[data-day="${todayUI}"]`).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "+ Nuevo evento" }).click();
    await expect(page.getByRole("dialog", { name: "Nuevo evento" })).toBeVisible();
    await expectNoAxeViolations(page);
  });

  // Derived from R5.1
  test("axe: diálogo de borrado abierto no tiene violaciones", async ({ page }) => {
    const today = todayKeyNode();
    await gotoCleanCalendar(page, seedForToday(today));
    const todayUI = await todayKey(page);
    await page.locator(`[data-day="${todayUI}"]`).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: /Borrar Evento de prueba/ }).click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await expectNoAxeViolations(page);
  });

  // Derived from R5.1
  test("axe: vista de bloqueo R1.4 no tiene violaciones", async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.setItem = function () {
        throw new DOMException("denied", "SecurityError");
      };
    });
    await page.goto("/calendar");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Esta aplicación necesita almacenamiento local",
      }),
    ).toBeVisible();
    await expectNoAxeViolations(page);
  });

  // Derived from R5.2
  test("crear evento de principio a fin usando sólo teclado", async ({ page }) => {
    await gotoCleanCalendar(page);
    const todayUI = await todayKey(page);

    // Foco en la celda de hoy y seleccionar con Enter.
    await page.locator(`[data-day="${todayUI}"]`).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("region", { name: /Eventos del/ })).toBeVisible();

    // Foco en el botón "+ Nuevo evento" y abrir con Enter.
    await page.getByRole("button", { name: "+ Nuevo evento" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Nuevo evento" })).toBeVisible();

    // Radix Dialog mueve foco al primer elemento focuseable (Título).
    await page.keyboard.type("Tarea desde teclado");

    // Tab hasta llegar al botón "Crear evento". El tab order incluye
    // el botón "Close" (X) del Dialog, así que no hardcodeamos cuántos
    // Tabs son; iteramos hasta encontrarlo.
    const submit = page.getByRole("button", { name: "Crear evento" });
    for (let i = 0; i < 12; i++) {
      const focused = await page.evaluate(() => document.activeElement?.textContent ?? "");
      if (focused.includes("Crear evento")) break;
      await page.keyboard.press("Tab");
    }
    await expect(submit).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page.getByText("Evento creado")).toBeVisible();
    await expect(page.getByRole("region", { name: /Eventos del/ })).toContainText(
      "Tarea desde teclado",
    );
  });

  // Derived from R5.2
  test("Escape cierra los diálogos y devuelve el foco", async ({ page }) => {
    const today = todayKeyNode();
    await gotoCleanCalendar(page, seedForToday(today));
    const todayUI = await todayKey(page);
    await page.locator(`[data-day="${todayUI}"]`).focus();
    await page.keyboard.press("Enter");

    const addButton = page.getByRole("button", { name: "+ Nuevo evento" });
    await addButton.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Nuevo evento" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Nuevo evento" })).toBeHidden();
    // El foco debe volver a un elemento focuseable (no quedar en body).
    // Radix Dialog devuelve el foco al elemento que tenía foco al abrir
    // cuando el Dialog es controlado por estado. Verificamos que el foco
    // está en un button (no en body) para cumplir el contrato a11y.
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(focusedTag).toBe("BUTTON");
  });
});
