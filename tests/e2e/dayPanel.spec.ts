import { expect, test } from "@playwright/test";

import { gotoCleanCalendar, selectDay, todayKey, type SeedEvent } from "./_helpers";

function todayKeyNode(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function seedMixedDayEvents(today: string): SeedEvent[] {
  return [
    {
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      title: "Reunión 14:00",
      start: `${today}T14:00`,
      end: `${today}T15:00`,
      allDay: false,
      status: "not-done",
      createdAt: `${today}T08:00`,
      updatedAt: `${today}T08:00`,
    },
    {
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      title: "Almuerzo",
      start: `${today}T12:30`,
      end: `${today}T13:30`,
      allDay: false,
      status: "not-done",
      createdAt: `${today}T08:00`,
      updatedAt: `${today}T08:00`,
    },
    {
      id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      title: "Cumpleaños",
      start: today,
      end: today,
      allDay: true,
      status: "not-done",
      createdAt: `${today}T08:00`,
      updatedAt: `${today}T08:00`,
    },
  ];
}

test.describe("panel del día", () => {
  // Derived from R2.2
  test("click en día muestra los eventos ordenados: allDay primero, luego por hora", async ({
    page,
  }) => {
    const today = todayKeyNode();
    await gotoCleanCalendar(page, seedMixedDayEvents(today));

    const todayUI = await todayKey(page);
    await selectDay(page, todayUI);

    const panel = page.getByRole("region", { name: /Eventos del/ });
    await expect(panel).toBeVisible();

    // Verifica orden visual: leemos los títulos de los `<li>` del panel.
    const titles = await panel.locator("li > label > span").nth(0).allTextContents();
    // El selector anterior coge sólo el primer item. Mejor: enumerar todos.
    const liTitles = await panel.locator("li").evaluateAll((nodes) =>
      nodes.map((n) => {
        const titleEl = n.querySelector("label > span:nth-child(1)");
        return titleEl?.textContent?.trim() ?? "";
      }),
    );

    expect(liTitles).toEqual(["Cumpleaños", "Almuerzo", "Reunión 14:00"]);
    expect(titles).toEqual(["Cumpleaños"]);
  });

  // Derived from R2.2 / R5.2
  test("activar celda con Enter desde teclado también muestra eventos", async ({ page }) => {
    const today = todayKeyNode();
    await gotoCleanCalendar(page, seedMixedDayEvents(today));

    // Mover foco a la celda de hoy y activar con Enter.
    await page.locator('[aria-current="date"]').focus();
    await page.keyboard.press("Enter");

    const panel = page.getByRole("region", { name: /Eventos del/ });
    await expect(panel).toContainText("Cumpleaños");
    await expect(panel).toContainText("Almuerzo");
    await expect(panel).toContainText("Reunión 14:00");
  });
});
