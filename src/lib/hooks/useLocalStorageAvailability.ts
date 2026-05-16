"use client";

import { useEffect, useState } from "react";

import { isLocalStorageAvailable } from "@/infrastructure/storage/localStorageAvailability";

// Hook que envuelve la detección de R1.4 (DEC-5):
// - `null` durante SSR / antes del mount (la UI muestra skeleton).
// - `true` / `false` tras `useEffect` ejecuta la probe.

export function useLocalStorageAvailability(): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    setAvailable(isLocalStorageAvailable());
  }, []);
  return available;
}
