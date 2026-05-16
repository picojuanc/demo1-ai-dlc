import { describe, expect, it } from "vitest";
import { logger } from "@/infrastructure/observability/logger";

// Smoke test del logger. No deriva de un R*.* — valida el contrato
// mínimo prescrito por stack/patterns.md § Logging.

describe("logger (T2)", () => {
  it("expone los niveles estándar de pino", () => {
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });

  it("incluye `service` en los bindings base", () => {
    expect(logger.bindings()).toMatchObject({ service: "demo1-ai-dlc" });
  });
});
