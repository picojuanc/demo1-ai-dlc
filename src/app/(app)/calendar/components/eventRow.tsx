"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import type { Event } from "@/domain/events/entities";
import { eventKind } from "@/domain/events/helpers";
import { cn } from "@/lib/utils";

// R2.2 — fila de evento en el panel del día.
// R4.3 — checkbox para toggle done/not-done.
// R5.1, R5.2 — controles accesibles con nombres explícitos.

export interface EventRowProps {
  event: Event;
  onToggle: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

function timeRangeLabel(event: Event): string {
  const kind = eventKind(event);
  switch (kind) {
    case "single-day-allday":
    case "multi-day-allday":
      return "Todo el día";
    case "single-day-timed": {
      const start = format(parseISO(event.start), "HH:mm");
      const end = format(parseISO(event.end), "HH:mm");
      return `${start}–${end}`;
    }
    case "multi-day-timed": {
      const start = format(parseISO(event.start), "d 'de' LLLL HH:mm", { locale: es });
      const end = format(parseISO(event.end), "d 'de' LLLL HH:mm", { locale: es });
      return `${start} → ${end}`;
    }
  }
}

export function EventRow({ event, onToggle, onEdit, onDelete }: EventRowProps): React.ReactElement {
  const done = event.status === "done";
  const checkboxId = `event-${event.id}-done`;
  const timeLabel = timeRangeLabel(event);

  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-md border border-border p-3",
        done && "opacity-60",
      )}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={done}
        onChange={() => onToggle(event)}
        className="mt-1 size-4 cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <label
        htmlFor={checkboxId}
        className={cn("flex-1 cursor-pointer select-none", done && "line-through")}
      >
        <span className="block text-sm font-medium">{event.title}</span>
        <span className="block text-xs text-muted-foreground">{timeLabel}</span>
        <span className="sr-only">{done ? "Marcar como pendiente" : "Marcar como hecho"}</span>
      </label>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(event)}
          aria-label={`Editar ${event.title}`}
        >
          Editar
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onDelete(event)}
          aria-label={`Borrar ${event.title}`}
        >
          Borrar
        </Button>
      </div>
    </li>
  );
}
