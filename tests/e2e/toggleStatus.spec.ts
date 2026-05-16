import { expect, test } from "@playwright/test";

import { gotoCleanCalendar, selectDay, todayKey, type SeedEvent } from "./_helpers";

function todayKeyNode(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function seed(today: string, status: "done" | "not-done" = "not-done"): SeedEvent {
  return {
    id: "22222222-2222-4222-8222-222222222222",
    title: "Tarea togglable",
    start: today,
    end: today,
    allDay: true,
    status,
    createdAt: `${today}T08:00`,
    updatedAt: `${today}T08:00`,
  };
}

test.describe("toggle hecho / no hecho", () => {
  // Derived from R4.3
  test("alternar de no-hecho a hecho desde el panel y persistir", async ({ page }) => {
    const today = todayKeyNode();
    await gotoCleanCalendar(page, [seed(today, "not-done")]);

    const todayUI = await todayKey(page);
    await selectDay(page, todayUI);

    const checkbox = page.getByRole("checkbox", { name: /Tarea togglable/ });
    await expect(checkbox).not.toBeChecked();

    await checkbox.click();
    await expect(checkbox).toBeChecked();

    // Persistencia: recargar y verificar que sigue marcado.
    await page.reload();
    await expect(page.getByRole("grid", { name: /Calendario,/ })).toBeVisible();
    await selectDay(page, todayUI);
    // Esperar a que el panel cargue el evento antes de chequear el checkbox.
    await expect(page.getByRole("region", { name: /Eventos del/ })).toContainText(
      "Tarea togglable",
    );
    await expect(page.getByRole("checkbox", { name: /Tarea togglable/ })).toBeChecked();
  });

  // Derived from R4.3
  test("alternar de hecho a no-hecho", async ({ page }) => {
    const today = todayKeyNode();
    await gotoCleanCalendar(page, [seed(today, "done")]);

    const todayUI = await todayKey(page);
    await selectDay(page, todayUI);

    const checkbox = page.getByRole("checkbox", { name: /Tarea togglable/ });
    await expect(checkbox).toBeChecked();

    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });
});
