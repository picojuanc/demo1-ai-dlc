import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useLocalStorageAvailability } from "@/lib/hooks/useLocalStorageAvailability";

describe("useLocalStorageAvailability", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  // Derived from R1.4
  it("retorna true cuando localStorage está disponible (tras mount)", () => {
    const { result } = renderHook(() => useLocalStorageAvailability());
    expect(result.current).toBe(true);
  });

  // Derived from R1.4
  it("retorna false cuando setItem lanza (storage no disponible)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });

    const { result } = renderHook(() => useLocalStorageAvailability());
    expect(result.current).toBe(false);
  });
});
