"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import type { Event } from "@/domain/events/entities";
import { eventInDay } from "@/domain/events/helpers";

import { EventRow } from "./eventRow";

// R2.2 — lista de eventos del día seleccionado en orden cronológico:
// primero "todo el día", luego por hora ascendente (`start.localeCompare`).
// R4.3 — el toggle se delega a `EventRow`.
// R5.1, R5.2 — section landmark, heading legible, lista semántica.

export interface DayPanelProps {
  selectedDay: string | null;
  events: Event[];
  onToggle: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onAddEvent: (day: string) => void;
}

function sortDayEvents(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    return a.start.localeCompare(b.start);
  });
}

export function DayPanel({
  selectedDay,
  events,
  onToggle,
  onEdit,
  onDelete,
  onAddEvent,
}: DayPanelProps): React.ReactElement {
  if (selectedDay === null) {
    return (
      <section
        aria-label="Detalle del día"
        className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground"
      >
        Selecciona un día del calendario para ver sus eventos.
      </section>
    );
  }

  const dayEvents = sortDayEvents(events.filter((e) => eventInDay(e, selectedDay)));
  const heading = format(parseISO(selectedDay), "EEEE d 'de' LLLL 'de' yyyy", {
    locale: es,
  });
  const headingCapitalised = heading.charAt(0).toUpperCase() + heading.slice(1);

  return (
    <section
      aria-label={`Eventos del ${heading}`}
      className="flex flex-col gap-3 rounded-md border border-border p-4"
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight">{headingCapitalised}</h2>
        <button
          type="button"
          onClick={() => onAddEvent(selectedDay)}
          className="rounded-md border border-input bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + Nuevo evento
        </button>
      </header>

      {dayEvents.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay eventos para este día.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {dayEvents.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
