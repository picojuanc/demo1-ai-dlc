import { expect, test } from "@playwright/test";

import {
  gotoCleanCalendar,
  gridCell,
  openDeleteDialog,
  openEditDialog,
  selectDay,
  submitEdit,
  todayKey,
  type SeedEvent,
} from "./_helpers";

function seedEvent(today: string): SeedEvent {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Evento original",
    start: `${today}T09:00`,
    end: `${today}T10:00`,
    allDay: false,
    status: "not-done",
    createdAt: `${today}T08:00`,
    updatedAt: `${today}T08:00`,
  };
}

test.describe("editar y borrar eventos", () => {
  // Derived from R4.1
  test("editar título y guardar cambios refleja en panel y grid", async ({ page }) => {
    // Sembrado en localStorage antes de cargar la app.
    await page.addInitScript(() => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const today = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      window.localStorage.setItem(
        "dad_events_v1",
        JSON.stringify({
          version: 1,
          events: [
            {
              id: "11111111-1111-4111-8111-111111111111",
              title: "Evento original",
              start: `${today}T09:00`,
              end: `${today}T10:00`,
              allDay: false,
              status: "not-done",
              createdAt: `${today}T08:00`,
              updatedAt: `${today}T08:00`,
            },
          ],
        }),
      );
    });
    await page.goto("/calendar");
    await expect(page.getByRole("grid", { name: /Calendario,/ })).toBeVisible();

    const today = await todayKey(page);
    await selectDay(page, today);

    await openEditDialog(page, "Evento original");

    const title = page.getByLabel("Título");
    await expect(title).toHaveValue("Evento original");
    await title.fill("Evento renombrado");

    await submitEdit(page);

    await expect(page.getByRole("region", { name: /Eventos del/ })).toContainText(
      "Evento renombrado",
    );
    await expect(gridCell(page, today)).toContainText("Evento renombrado");
  });

  // Derived from R4.2
  test("borrar pide confirmación; cancelar preserva el evento", async ({ page }) => {
    const today = (() => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    })();
    await gotoCleanCalendar(page, [seedEvent(today)]);

    await selectDay(page, today);
    await openDeleteDialog(page, "Evento original");

    await expect(page.getByText('Vas a borrar "Evento original"')).toBeVisible();

    await page.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("alertdialog")).toBeHidden();

    // El evento sigue ahí.
    await expect(page.getByRole("region", { name: /Eventos del/ })).toContainText(
      "Evento original",
    );
  });

  // Derived from R4.2
  test("borrar confirmado elimina el evento del panel y del grid", async ({ page }) => {
    const today = (() => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    })();
    await gotoCleanCalendar(page, [seedEvent(today)]);

    await selectDay(page, today);
    await openDeleteDialog(page, "Evento original");

    await page.getByRole("button", { name: "Borrar evento" }).click();

    await expect(page.getByText("Evento eliminado")).toBeVisible();
    await expect(page.getByRole("alertdialog")).toBeHidden();
    await expect(page.getByRole("region", { name: /Eventos del/ })).toContainText(
      "No hay eventos para este día.",
    );
    await expect(gridCell(page, today)).not.toContainText("Evento original");
  });
});
