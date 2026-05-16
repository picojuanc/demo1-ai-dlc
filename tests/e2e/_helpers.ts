import { expect, type Page } from "@playwright/test";

// Helpers compartidos entre specs E2E. La feature persiste en
// `localStorage`, así que cada test arranca con storage limpio.

export const STORAGE_KEY = "dad_events_v1";

export async function gotoCleanCalendar(page: Page): Promise<void> {
  await page.addInitScript(() => {
    try {
      window.localStorage.clear();
    } catch {
      // ignore (Safari incógnito, etc.)
    }
  });
  await page.goto("/calendar");
  // Esperar a que el hook de disponibilidad termine y renderice el grid.
  await expect(page.getByRole("grid", { name: /Calendario,/ })).toBeVisible();
}

export async function todayKey(page: Page): Promise<string> {
  const cell = page.locator('[aria-current="date"]');
  const day = await cell.getAttribute("data-day");
  if (!day) throw new Error("No se encontró celda con aria-current=date");
  return day;
}

export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y!, m! - 1, d! + n);
  const pad = (x: number) => x.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export async function selectDay(page: Page, day: string): Promise<void> {
  await page.locator(`[data-day="${day}"]`).click();
}

export async function openCreateDialog(page: Page): Promise<void> {
  await page.getByRole("button", { name: "+ Nuevo evento" }).click();
  await expect(page.getByRole("dialog", { name: "Nuevo evento" })).toBeVisible();
}

export async function fillTitle(page: Page, title: string): Promise<void> {
  await page.getByLabel("Título").fill(title);
}

export async function setAllDay(page: Page, allDay: boolean): Promise<void> {
  const checkbox = page.getByLabel("Todo el día");
  const current = await checkbox.isChecked();
  if (current !== allDay) await checkbox.click();
}

export async function setStart(page: Page, value: string): Promise<void> {
  await page.getByLabel("Inicio").fill(value);
}

export async function setEnd(page: Page, value: string): Promise<void> {
  await page.getByLabel("Fin").fill(value);
}

export async function submitCreate(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Crear evento" }).click();
  await expect(page.getByText("Evento creado")).toBeVisible();
  // Dialog se cierra tras éxito.
  await expect(page.getByRole("dialog", { name: "Nuevo evento" })).toBeHidden();
}

export function gridCell(page: Page, day: string) {
  return page.locator(`[data-day="${day}"]`);
}
