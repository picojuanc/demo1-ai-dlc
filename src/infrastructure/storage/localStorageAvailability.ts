// R1.4 — DEC-5: detección por probe write. Cubre los 3 casos
// (no soportado, deshabilitado, modo privado restringido).

const PROBE_KEY = "__dad_probe__";

export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.setItem(PROBE_KEY, "1");
    window.localStorage.removeItem(PROBE_KEY);
    return true;
  } catch {
    return false;
  }
}
