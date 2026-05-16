import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        // shadcn — generado por la herramienta, ver `stack/patterns.md`.
        "src/components/ui/**",
        "src/**/*.types.ts",
        "src/**/*.d.ts",
        // Next shells (no lógica testeable).
        "src/app/layout.tsx",
        "src/app/page.tsx",
        // UI de la feature: cobertura mediante Playwright E2E (T11–T15),
        // no via vitest.
        "src/app/(app)/**",
        // Composition root: wiring puro, cubierto vía integration + E2E.
        "src/composition.ts",
        // Utility de shadcn (cn = clsx + tailwind-merge).
        "src/lib/utils.ts",
        // Archivos sólo-tipos (entidades, errores, value objects, puerto).
        "src/domain/events/entities.ts",
        "src/domain/events/errors.ts",
        "src/domain/events/valueObjects.ts",
        "src/application/events/ports/**",
        // Config / instrumentación.
        "next.config.ts",
        "tailwind.config.ts",
        "instrumentation.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        "src/domain/**": {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
        "src/application/**": {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
