"use client";

import { useLocalStorageAvailability } from "@/lib/hooks/useLocalStorageAvailability";

import { LocalStorageUnavailable } from "./components/localStorageUnavailable";

// Isla cliente principal de la feature. Decide entre la vista de
// bloqueo (R1.4) y el calendario propiamente dicho.

export function CalendarApp(): React.ReactElement {
  const available = useLocalStorageAvailability();

  if (available === null) {
    return (
      <main role="main" aria-busy="true" className="flex min-h-screen items-center justify-center">
        <span className="sr-only">Cargando calendario…</span>
      </main>
    );
  }

  if (!available) return <LocalStorageUnavailable />;

  // T8+ reemplazará este placeholder con `monthHeader` + `monthGrid` +
  // `dayPanel`. Por ahora dejamos un shell mínimo para que el dev server
  // no rompa y la ruta sea navegable.
  return (
    <main role="main" className="container mx-auto flex min-h-screen flex-col gap-6 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Calendario</h1>
      <p className="text-muted-foreground">
        La vista del calendario se implementa en las próximas tasks (T8–T10).
      </p>
    </main>
  );
}
