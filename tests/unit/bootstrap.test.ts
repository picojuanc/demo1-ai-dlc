import { describe, expect, it } from "vitest";

// Smoke test del bootstrap (T1). Garantiza que la suite Vitest se
// ejecuta correctamente con TypeScript estricto + jsdom + el setup
// de @testing-library/jest-dom. NO está derivado de un R*.* — sirve
// solo para validar el setup. Se borra cuando T3 introduzca tests
// reales del dominio.

describe("bootstrap (T1)", () => {
  it("ejecuta vitest con el alias @/ configurado", async () => {
    const { cn } = await import("@/lib/utils");
    expect(cn("a", "b")).toBe("a b");
  });

  it("permite usar matchers de jest-dom", () => {
    const el = document.createElement("div");
    el.textContent = "hola";
    expect(el).toHaveTextContent("hola");
  });
});
