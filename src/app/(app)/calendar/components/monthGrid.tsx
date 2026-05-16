"use client";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { Event } from "@/domain/events/entities";
import { eventInDay } from "@/domain/events/helpers";
import { cn } from "@/lib/utils";

// R2.1, R2.3, R2.4, R5.1, R5.2 — grilla mensual semana-lunes con
// roving tabindex, aria-current=date, soporte completo de teclado
// (flechas, Home/End, PageUp/PageDown, Enter/Space).

export interface MonthGridProps {
  visibleMonth: Date;
  events: Event[];
  selectedDay: string | null;
  today: Date;
  onSelectDay: (day: string) => void;
  onChangeVisibleMonth: (next: Date) => void;
}

const WEEK_DAYS_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEK_DAYS_LONG = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const WEEK_OPTS = { weekStartsOn: 1 as const };

function key(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function MonthGrid({
  visibleMonth,
  events,
  selectedDay,
  today,
  onSelectDay,
  onChangeVisibleMonth,
}: MonthGridProps): React.ReactElement {
  const gridStart = startOfWeek(startOfMonth(visibleMonth), WEEK_OPTS);
  const gridEnd = endOfWeek(endOfMonth(visibleMonth), WEEK_OPTS);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const todayKey = key(today);
  const [focusedDay, setFocusedDay] = useState<string>(
    () =>
      selectedDay ??
      (isSameMonth(today, visibleMonth) ? todayKey : key(startOfMonth(visibleMonth))),
  );

  const gridRef = useRef<HTMLTableElement | null>(null);
  const userMovedFocus = useRef(false);

  // Si el mes visible cambia desde afuera (header) y el focused day no
  // está en el grid actual, lo reseteamos al primer día del mes.
  useEffect(() => {
    const inGrid = days.some((d) => key(d) === focusedDay);
    if (!inGrid) setFocusedDay(key(startOfMonth(visibleMonth)));
    // intencional: sólo reaccionar al cambio de mes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleMonth]);

  // Tras navegación por teclado, mover el foco real a la celda nueva.
  useEffect(() => {
    if (!userMovedFocus.current) return;
    userMovedFocus.current = false;
    const cell = gridRef.current?.querySelector<HTMLTableCellElement>(`[data-day="${focusedDay}"]`);
    cell?.focus();
  }, [focusedDay]);

  const moveByDays = useCallback(
    (delta: number) => {
      userMovedFocus.current = true;
      const next = addDays(parseISO(focusedDay), delta);
      const nextKey = key(next);
      setFocusedDay(nextKey);
      if (!isSameMonth(next, visibleMonth)) onChangeVisibleMonth(startOfMonth(next));
    },
    [focusedDay, visibleMonth, onChangeVisibleMonth],
  );

  const moveTo = useCallback(
    (target: Date) => {
      userMovedFocus.current = true;
      setFocusedDay(key(target));
      if (!isSameMonth(target, visibleMonth)) {
        onChangeVisibleMonth(startOfMonth(target));
      }
    },
    [visibleMonth, onChangeVisibleMonth],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTableCellElement>) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        moveByDays(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        moveByDays(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveByDays(-7);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveByDays(7);
        break;
      case "Home":
        e.preventDefault();
        moveTo(startOfWeek(parseISO(focusedDay), WEEK_OPTS));
        break;
      case "End":
        e.preventDefault();
        moveTo(endOfWeek(parseISO(focusedDay), WEEK_OPTS));
        break;
      case "PageUp":
        e.preventDefault();
        moveTo(addMonths(parseISO(focusedDay), -1));
        break;
      case "PageDown":
        e.preventDefault();
        moveTo(addMonths(parseISO(focusedDay), 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onSelectDay(focusedDay);
        break;
    }
  };

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const monthLabel = format(visibleMonth, "LLLL yyyy", { locale: es });

  return (
    <table
      ref={gridRef}
      role="grid"
      aria-label={`Calendario, ${monthLabel}`}
      className="w-full border-separate border-spacing-0"
    >
      <thead>
        <tr>
          {WEEK_DAYS_SHORT.map((short, i) => (
            <th
              key={short}
              scope="col"
              className="border-b py-2 text-sm font-medium text-muted-foreground"
            >
              <span aria-hidden="true">{short}</span>
              <span className="sr-only">{WEEK_DAYS_LONG[i]}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, wi) => (
          <tr key={wi} role="row">
            {week.map((day) => {
              const dayKey = key(day);
              const inMonth = isSameMonth(day, visibleMonth);
              const isToday = isSameDay(day, today);
              const isSelected = dayKey === selectedDay;
              const isFocused = dayKey === focusedDay;
              const dayEvents = events.filter((e) => eventInDay(e, dayKey));
              const longLabel = format(day, "EEEE d 'de' LLLL 'de' yyyy", { locale: es });
              const eventsLabel = dayEvents.length
                ? `, ${dayEvents.length} evento${dayEvents.length === 1 ? "" : "s"}`
                : "";

              return (
                <td
                  key={dayKey}
                  role="gridcell"
                  data-day={dayKey}
                  tabIndex={isFocused ? 0 : -1}
                  aria-current={isToday ? "date" : undefined}
                  aria-selected={isSelected ? true : undefined}
                  aria-label={`${longLabel}${eventsLabel}`}
                  onClick={() => {
                    setFocusedDay(dayKey);
                    onSelectDay(dayKey);
                    if (!inMonth) onChangeVisibleMonth(startOfMonth(day));
                  }}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "h-24 border border-border p-1 text-left align-top text-sm",
                    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    !inMonth && "bg-muted/30 text-muted-foreground",
                    isToday && "bg-accent/40 font-semibold",
                    isSelected && "ring-2 ring-primary",
                  )}
                >
                  <span className="block text-right text-xs">{format(day, "d")}</span>
                  <ul className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <li
                        key={ev.id}
                        className={cn(
                          "truncate rounded bg-primary/10 px-1 text-xs",
                          ev.status === "done" && "line-through opacity-60",
                        )}
                      >
                        {ev.title}
                      </li>
                    ))}
                    {dayEvents.length > 3 && (
                      <li className="text-xs text-muted-foreground">+{dayEvents.length - 3} más</li>
                    )}
                  </ul>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
