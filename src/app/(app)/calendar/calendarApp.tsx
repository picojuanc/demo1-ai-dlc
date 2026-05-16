"use client";

import { addMonths, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";

import type { Event } from "@/domain/events/entities";
import type { EventStoreError } from "@/domain/events/errors";
import { getListEvents } from "@/composition";
import { useLocalStorageAvailability } from "@/lib/hooks/useLocalStorageAvailability";

import { LocalStorageUnavailable } from "./components/localStorageUnavailable";
import { MonthGrid } from "./components/monthGrid";
import { MonthHeader } from "./components/monthHeader";

// Isla cliente principal. Maneja:
// - Detección de disponibilidad (R1.4).
// - Carga inicial de eventos (R1.2).
// - Mes visible + día seleccionado (R2.1, R2.2, R2.3).

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

  return <CalendarMain />;
}

function CalendarMain(): React.ReactElement {
  const [today] = useState<Date>(() => new Date());
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfMonth(today));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadError, setLoadError] = useState<EventStoreError | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getListEvents()().then((result) => {
      if (cancelled) return;
      if (result.ok) setEvents(result.value);
      else setLoadError(result.error);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main role="main" className="container mx-auto flex min-h-screen flex-col gap-4 p-4 md:p-8">
      {loadError && <LoadErrorBanner error={loadError} />}
      <MonthHeader
        visibleMonth={visibleMonth}
        onPrev={() => setVisibleMonth((m) => addMonths(m, -1))}
        onNext={() => setVisibleMonth((m) => addMonths(m, 1))}
        onToday={() => setVisibleMonth(startOfMonth(today))}
      />
      <MonthGrid
        visibleMonth={visibleMonth}
        events={events}
        selectedDay={selectedDay}
        today={today}
        onSelectDay={setSelectedDay}
        onChangeVisibleMonth={setVisibleMonth}
      />
    </main>
  );
}

function LoadErrorBanner({ error }: { error: EventStoreError }): React.ReactElement {
  const message = errorMessage(error);
  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
    >
      {message}
    </div>
  );
}

function errorMessage(error: EventStoreError): string {
  switch (error.kind) {
    case "schemaUnknown":
      return "Datos guardados en formato desconocido. Recarga después de actualizar el navegador o contacta al soporte.";
    case "corruptedStorage":
      return "Los datos del calendario están dañados.";
    case "quotaExceeded":
      return "No se pudo guardar el cambio. El almacenamiento del navegador está lleno.";
    case "notFound":
      return "El evento ya no existe. Recarga el calendario.";
    case "unavailable":
      return "El almacenamiento local no está disponible.";
  }
}
