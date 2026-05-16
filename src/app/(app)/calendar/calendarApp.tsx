"use client";

import { addMonths, startOfMonth } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { Event } from "@/domain/events/entities";
import type { EventStoreError } from "@/domain/events/errors";
import type { EventInput } from "@/domain/events/schemas";
import {
  getCreateEvent,
  getDeleteEvent,
  getEditEvent,
  getListEvents,
  getToggleEventStatus,
} from "@/composition";
import { useLocalStorageAvailability } from "@/lib/hooks/useLocalStorageAvailability";

import { DayPanel } from "./components/dayPanel";
import { DeleteEventDialog } from "./components/deleteEventDialog";
import { EventFormDialog, type EventFormMode } from "./components/eventFormDialog";
import { LocalStorageUnavailable } from "./components/localStorageUnavailable";
import { MonthGrid } from "./components/monthGrid";
import { MonthHeader } from "./components/monthHeader";

// Isla cliente principal. Maneja:
// - Detección de disponibilidad (R1.4).
// - Carga inicial de eventos (R1.2).
// - Estado de mes visible + día seleccionado (R2.1, R2.2, R2.3).
// - Diálogos de crear/editar/borrar (R3.x, R4.1, R4.2) y toggle (R4.3).

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

  const [formMode, setFormMode] = useState<EventFormMode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  // Radix Dialog controlado por estado (sin DialogTrigger) no restaura
  // el foco al cerrarse. Guardamos el elemento que abrió el diálogo y
  // lo refocuseamos en onOpenChange (R5.1, R5.2 — devolución de foco).
  const triggerRef = useRef<HTMLElement | null>(null);
  const captureTrigger = () => {
    triggerRef.current = document.activeElement as HTMLElement | null;
  };
  const restoreTrigger = () => {
    queueMicrotask(() => triggerRef.current?.focus());
  };

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

  const handleToggle = useCallback(async (event: Event) => {
    const result = await getToggleEventStatus()(event);
    if (result.ok) {
      setEvents((prev) => prev.map((e) => (e.id === result.value.id ? result.value : e)));
    } else {
      reportStoreError(result.error);
    }
  }, []);

  const handleAddEvent = useCallback((day: string) => {
    captureTrigger();
    setFormMode({ kind: "create", defaultDay: day });
  }, []);

  const handleEdit = useCallback((event: Event) => {
    captureTrigger();
    setFormMode({ kind: "edit", event });
  }, []);

  const handleDelete = useCallback((event: Event) => {
    captureTrigger();
    setDeleteTarget(event);
  }, []);

  const handleSubmitForm = useCallback(
    async (input: EventInput, mode: EventFormMode): Promise<boolean> => {
      if (mode.kind === "create") {
        const result = await getCreateEvent()(input);
        if (result.ok) {
          setEvents((prev) => [...prev, result.value]);
          toast.success("Evento creado");
          return true;
        }
        if (result.error.kind === "validation") {
          // Shouldn't happen — RHF ya validó. Defensa.
          toast.error("Datos inválidos");
          return false;
        }
        reportStoreError(result.error);
        return false;
      }

      const result = await getEditEvent()(mode.event, input);
      if (result.ok) {
        setEvents((prev) => prev.map((e) => (e.id === result.value.id ? result.value : e)));
        toast.success("Cambios guardados");
        return true;
      }
      if (result.error.kind === "validation") {
        toast.error("Datos inválidos");
        return false;
      }
      reportStoreError(result.error);
      return false;
    },
    [],
  );

  const handleConfirmDelete = useCallback(async (event: Event) => {
    const result = await getDeleteEvent()(event.id);
    if (result.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      toast.success("Evento eliminado");
      setDeleteTarget(null);
    } else {
      reportStoreError(result.error);
      setDeleteTarget(null);
    }
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
      <DayPanel
        selectedDay={selectedDay}
        events={events}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddEvent={handleAddEvent}
      />

      <EventFormDialog
        open={formMode !== null}
        mode={formMode}
        onOpenChange={(open) => {
          if (!open) {
            setFormMode(null);
            restoreTrigger();
          }
        }}
        onSubmit={handleSubmitForm}
      />
      <DeleteEventDialog
        open={deleteTarget !== null}
        event={deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            restoreTrigger();
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}

function reportStoreError(error: EventStoreError): void {
  switch (error.kind) {
    case "quotaExceeded":
      toast.error("No se pudo guardar el cambio. El almacenamiento del navegador está lleno.");
      return;
    case "notFound":
      toast.error("El evento ya no existe. Recarga el calendario.");
      return;
    case "corruptedStorage":
      toast.error("Los datos del calendario están dañados.");
      return;
    case "schemaUnknown":
      toast.error("Datos guardados en formato desconocido.");
      return;
    case "unavailable":
      toast.error("El almacenamiento local no está disponible.");
      return;
  }
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
