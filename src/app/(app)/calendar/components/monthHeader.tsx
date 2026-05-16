"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";

// R2.3 — navegación entre meses + título visible. R5.1, R5.2 —
// botones con nombres accesibles, contraste por Tailwind base, foco
// visible vía `focus-visible:ring`.

export interface MonthHeaderProps {
  visibleMonth: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const buttonClass = cn(
  "inline-flex items-center justify-center rounded-md border border-input",
  "bg-background px-3 py-1.5 text-sm font-medium",
  "transition-colors hover:bg-accent hover:text-accent-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "disabled:pointer-events-none disabled:opacity-50",
);

export function MonthHeader({
  visibleMonth,
  onPrev,
  onNext,
  onToday,
}: MonthHeaderProps): React.ReactElement {
  const title = format(visibleMonth, "LLLL yyyy", { locale: es });
  const capitalised = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
      <h1 className="text-2xl font-semibold tracking-tight" aria-live="polite" aria-atomic="true">
        {capitalised}
      </h1>
      <nav aria-label="Navegación del calendario" className="flex gap-2">
        <button type="button" className={buttonClass} onClick={onPrev}>
          <span aria-hidden="true">‹</span>
          <span className="sr-only">Mes anterior</span>
        </button>
        <button type="button" className={buttonClass} onClick={onToday}>
          Hoy
        </button>
        <button type="button" className={buttonClass} onClick={onNext}>
          <span aria-hidden="true">›</span>
          <span className="sr-only">Mes siguiente</span>
        </button>
      </nav>
    </header>
  );
}
