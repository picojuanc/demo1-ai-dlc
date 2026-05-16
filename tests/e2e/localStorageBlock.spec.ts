import { expect, test } from "@playwright/test";

// Derived from R1.4
// Cuando `localStorage` no está disponible, la única UI visible es la
// vista de bloqueo con mensaje en español y foco inicial en el h1.

test.describe("bloqueo cuando localStorage no está disponible", () => {
  test.beforeEach(async ({ page }) => {
    // Rompemos `Storage.prototype.setItem` antes de que carguen los
    // scripts de la app. La probe del hook llama `setItem`, atrapa la
    // excepción y retorna false.
    await page.addInitScript(() => {
      Storage.prototype.setItem = function () {
        throw new DOMException("denied", "SecurityError");
      };
    });
  });

  // Derived from R1.4
  test("renderiza vista de bloqueo con mensaje en español", async ({ page }) => {
    await page.goto("/calendar");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Esta aplicación necesita almacenamiento local",
      }),
    ).toBeVisible();

    await expect(
      page.getByText(/El calendario guarda tus eventos directamente en el navegador/),
    ).toBeVisible();
    await expect(
      page.getByText(/habilita el almacenamiento del sitio o sal del modo de navegación privada/),
    ).toBeVisible();
  });

  // Derived from R1.4 / R5.1
  test("no muestra el calendario ni controles de gestión", async ({ page }) => {
    await page.goto("/calendar");

    // Esperar al render de la vista de bloqueo.
    await expect(
      page.getByRole("heading", { name: "Esta aplicación necesita almacenamiento local" }),
    ).toBeVisible();

    // El grid del calendario NO debe existir.
    await expect(page.getByRole("grid")).toHaveCount(0);
    // El panel del día tampoco.
    await expect(page.getByRole("region", { name: /Eventos del/ })).toHaveCount(0);
    // No hay botones de gestión visibles (Hoy, Mes anterior, etc.).
    await expect(page.getByRole("button", { name: "Hoy" })).toHaveCount(0);
  });

  // Derived from R5.1
  test("foco inicial está en el h1 de bloqueo (a11y)", async ({ page }) => {
    await page.goto("/calendar");

    const heading = page.getByRole("heading", {
      level: 1,
      name: "Esta aplicación necesita almacenamiento local",
    });
    await expect(heading).toBeVisible();
    await expect(heading).toBeFocused();
  });
});
