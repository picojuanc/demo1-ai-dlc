import { afterEach, describe, expect, it, vi } from "vitest";

import { isLocalStorageAvailable } from "@/infrastructure/storage/localStorageAvailability";

describe("isLocalStorageAvailable", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  // Derived from R1.4
  it("retorna true cuando setItem y removeItem funcionan", () => {
    expect(isLocalStorageAvailable()).toBe(true);
    // No deja residuos: la probe key fue borrada.
    expect(window.localStorage.getItem("__dad_probe__")).toBeNull();
  });

  // Derived from R1.4
  it("retorna false cuando setItem lanza", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    expect(isLocalStorageAvailable()).toBe(false);
  });

  // Derived from R1.4
  it("retorna false cuando removeItem lanza", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("boom");
    });
    expect(isLocalStorageAvailable()).toBe(false);
  });

  // Derived from R1.4
  it("retorna false cuando setItem simula QuotaExceededError", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });
    expect(isLocalStorageAvailable()).toBe(false);
  });
});
