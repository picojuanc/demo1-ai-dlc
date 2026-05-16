# Design — events-calendar

> **Feature**: `events-calendar`
> **Servicio**: `demo1-ai-dlc`
> **Base spec**: `requirements.md` (commit `1d43491`, firmado G2 ✅)
> **Estado**: completo. Listo para firma de **G3**.

## 1. Arquitectura

Se aplica `stack/architecture.md` (Clean Architecture), adaptado al
caso 100% client-side:

```
┌──────────────────────────────────────────────────────────────┐
│ Presentation: app/(app)/calendar/                            │
│   - page.tsx (RSC, metadata + shell)                         │
│   - calendarApp.tsx ("use client", isla principal)           │
│   - components/ (todos "use client")                         │
└────────────┬─────────────────────────────────────────────────┘
             │ usa
             ▼
┌──────────────────────────────────────────────────────────────┐
│ Application: events/use-cases + events/ports                 │
│   createEvent / editEvent / deleteEvent /                    │
│   toggleEventStatus / listEvents                             │
└────────────┬─────────────────────────────┬───────────────────┘
             │ usa                          ▲ implementa
             ▼                              │
┌────────────────────────────────────┐  ┌──┴──────────────────┐
│ Domain: events/                    │  │ Infrastructure:     │
│   entities, value objects,         │  │   localStorageEvent │
│   schemas Zod, helpers (eventKind, │  │   Store (impl del   │
│   eventInDay, eventsInRange)       │  │   puerto EventStore)│
└────────────────────────────────────┘  └─────────────────────┘
```

**Por qué Clean Arch aunque no haya backend:** el puerto
`EventStore` permite cambiar la persistencia (a `idb-keyval`,
IndexedDB nativo o eventualmente un backend) sin tocar use cases ni
componentes. Los helpers de dominio (`eventKind`, `eventInDay`)
son puros y reutilizables entre vistas/tests.

## 2. Estructura de archivos

```
src/
├── app/
│   └── (app)/
│       └── calendar/
│           ├── page.tsx                         # RSC, metadata
│           ├── calendarApp.tsx                  # 'use client', isla principal
│           └── components/                      # todos 'use client'
│               ├── localStorageUnavailable.tsx  # R1.4 — vista de bloqueo
│               ├── monthGrid.tsx                # R2.1, R2.4 — grilla mes
│               ├── monthHeader.tsx              # R2.3 — navegación meses
│               ├── dayPanel.tsx                 # R2.2 — lista eventos del día
│               ├── eventFormDialog.tsx          # R3.x, R4.1 — crear/editar
│               ├── deleteEventDialog.tsx        # R4.2 — confirmación
│               └── eventRow.tsx                 # ítem en dayPanel (toggle, edit, delete)
│
├── domain/
│   └── events/
│       ├── entities.ts                          # Event, EventId, EventStatus
│       ├── valueObjects.ts                      # EventKind (derivado), DateRange
│       ├── schemas.ts                           # Zod schemas (eventSchema, persistedSchema)
│       ├── helpers.ts                           # eventKind, eventInDay, eventsInRange, isAllDayCompatible
│       └── errors.ts                            # AuthError? no aplica; EventValidationError
│
├── application/
│   └── events/
│       ├── ports/
│       │   └── eventStore.ts                    # interface async
│       └── useCases/
│           ├── createEvent.ts
│           ├── editEvent.ts
│           ├── deleteEvent.ts
│           ├── toggleEventStatus.ts
│           └── listEvents.ts
│
├── infrastructure/
│   ├── storage/
│   │   ├── localStorageAvailability.ts          # función pura isAvailable()
│   │   └── localStorageEventStore.ts            # impl EventStore
│   └── observability/
│       └── logger.ts                            # heredado del stack
│
├── lib/
│   └── hooks/
│       └── useLocalStorageAvailability.ts       # hook que envuelve isAvailable()
│
├── components/ui/                               # generados por shadcn (no editar a mano)
│
├── shared/
│   └── result.ts                                # Result<T,E> ya definido por stack/patterns.md
│
└── composition.ts                               # wiring del EventStore al UI

tests/
├── unit/
│   ├── domain/events/
│   │   ├── eventKind.test.ts                    # R3.1-R3.4 (clasificación)
│   │   ├── eventInDay.test.ts                   # R2.4 (cálculo de rango)
│   │   ├── eventsInRange.test.ts                # R2.1
│   │   └── schemas.test.ts                      # R3.5, R3.6 (validaciones Zod)
│   ├── application/events/
│   │   ├── createEvent.test.ts                  # R3.x
│   │   ├── editEvent.test.ts                    # R4.1
│   │   ├── deleteEvent.test.ts                  # R4.2
│   │   ├── toggleEventStatus.test.ts            # R4.3
│   │   └── listEvents.test.ts                   # R1.2
│   └── infrastructure/storage/
│       ├── localStorageAvailability.test.ts     # R1.4
│       └── localStorageEventStore.test.ts       # R1.1, R1.3
├── integration/
│   └── persistence.test.ts                      # R1.1 + R1.2 round-trip en jsdom
└── e2e/
    ├── localStorageBlock.spec.ts                # R1.4 (UI bloqueada + a11y)
    ├── createSingleDayTimed.spec.ts             # R3.1
    ├── createSingleDayAllDay.spec.ts            # R3.2
    ├── createMultiDayAllDay.spec.ts             # R3.3
    ├── createMultiDayTimed.spec.ts              # R3.4
    ├── validations.spec.ts                      # R3.5, R3.6
    ├── editAndDelete.spec.ts                    # R4.1, R4.2
    ├── toggleStatus.spec.ts                     # R4.3
    ├── monthNavigation.spec.ts                  # R2.1, R2.3
    ├── dayPanel.spec.ts                         # R2.2
    ├── multiDayDisplay.spec.ts                  # R2.4
    └── keyboardA11y.spec.ts                     # R5.1, R5.2
```

## 3. Modelo de datos

### 3.1 `Event` (entidad de dominio)

```ts
// src/domain/events/entities.ts
export type EventId = string;
export type EventStatus = "done" | "not-done";

export type Event = {
  id: EventId;
  title: string;
  start: string;     // "YYYY-MM-DD" si allDay, sino "YYYY-MM-DDTHH:mm"
  end: string;       // mismo formato que start
  allDay: boolean;
  status: EventStatus;
  createdAt: string; // ISO local — auditable
  updatedAt: string; // ISO local — actualizado en cada mutación
};
```

El campo `kind` (single-day-timed / single-day-allday /
multi-day-timed / multi-day-allday) **se deriva** vía helper
(no se persiste), evitando estados inconsistentes:

```ts
// src/domain/events/helpers.ts
export type EventKind =
  | "single-day-timed"
  | "single-day-allday"
  | "multi-day-timed"
  | "multi-day-allday";

export function eventKind(e: Event): EventKind {
  const sameDay = e.start.slice(0, 10) === e.end.slice(0, 10);
  if (e.allDay && sameDay)   return "single-day-allday";
  if (e.allDay && !sameDay)  return "multi-day-allday";
  if (!e.allDay && sameDay)  return "single-day-timed";
  return "multi-day-timed";
}
```

### 3.2 Schema persistido en `localStorage`

- **Key**: `dad_events_v1` (`d`emo `a`i `d`lc + recurso + version).
- **Valor**: JSON serializado con el shape:

```ts
type PersistedState = {
  version: 1;
  events: Event[];
};
```

- **Validación al leer**: Zod schema `persistedSchema` (en
  `domain/events/schemas.ts`). Si el parse falla:
  - `version` desconocida → `EventStoreError { kind: "schemaUnknown" }`.
  - JSON inválido → `EventStoreError { kind: "corruptedStorage" }`.

  En ambos casos: **no se sobrescribe** el storage; la UI muestra
  un componente dedicado con opción de descargar el raw para
  recovery manual (post-v1; v1 sólo muestra mensaje y bloquea).

- **Migrations**: ausentes en v1. Cuando v2 cambie el shape, agregar
  `migrate(v: number, raw: unknown): Result<PersistedState, ...>` y
  bumpear la key a `dad_events_v2` (o mantener key con `version: 2`
  + migrate).

### 3.3 IDs

`crypto.randomUUID()` (Web Crypto API). Soportado en todos los
navegadores modernos. No requiere librería extra. Si en el futuro
necesita orden lexicográfico (para sorting), considerar ULID.

### 3.4 Zod schemas

```ts
// src/domain/events/schemas.ts
import { z } from "zod";

const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
const dateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const eventSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(1, "El título es obligatorio"),
    start: z.string(),
    end: z.string(),
    allDay: z.boolean(),
    status: z.enum(["done", "not-done"]),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .superRefine((e, ctx) => {
    const fmt = e.allDay ? dateOnly : dateTime;
    if (!fmt.test(e.start)) {
      ctx.addIssue({ code: "custom", path: ["start"], message: "Formato inválido" });
    }
    if (!fmt.test(e.end)) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "Formato inválido" });
    }
    if (e.end < e.start) {
      ctx.addIssue({
        code: "custom",
        path: ["end"],
        message: "El fin no puede ser anterior al inicio",
      });
    }
  });

export const persistedSchema = z.object({
  version: z.literal(1),
  events: z.array(eventSchema),
});

// para forms (sin id/createdAt/updatedAt — los pone el use case)
export const eventFormSchema = eventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});
```

## 4. Contratos / interfaces internas

### 4.1 Puerto `EventStore`

```ts
// src/application/events/ports/eventStore.ts
import type { Result } from "@/shared/result";
import type { Event, EventId } from "@/domain/events/entities";

export type EventStoreError =
  | { kind: "unavailable" }            // localStorage no disponible (R1.4)
  | { kind: "schemaUnknown"; got: unknown }
  | { kind: "corruptedStorage" }
  | { kind: "quotaExceeded" }
  | { kind: "notFound"; id: EventId };

export interface EventStore {
  list(): Promise<Result<Event[], EventStoreError>>;
  save(event: Event): Promise<Result<void, EventStoreError>>;
  delete(id: EventId): Promise<Result<void, EventStoreError>>;
}
```

> Async por diseño aunque la impl actual sea síncrona — preserva la
> opción de mover a IndexedDB o backend sin refactor.

### 4.2 UI components (shadcn/ui a instalar)

```bash
pnpm dlx shadcn@latest add button input label checkbox \
  dialog alert-dialog dropdown-menu form sonner card
```

| Componente shadcn | Uso |
|---|---|
| `button`, `input`, `label`, `checkbox` | controles del form de evento |
| `form` | wrapper RHF + zod |
| `dialog` | modal crear/editar evento |
| `alert-dialog` | confirmación de borrado (R4.2) |
| `dropdown-menu` | acciones por evento (edit, delete) |
| `sonner` | toasts (error de quotaExceeded al guardar) |
| `card` | container del panel del día (R2.2) |

> No se usa `<Calendar>` de shadcn (date-picker) para la grilla
> mensual — esa pieza se construye a mano con `eachDayOfInterval`
> de date-fns. `<Calendar>` sí se reutiliza dentro del form para
> elegir fechas.

## 5. Decisiones arquitectónicas (DEC-N)

### DEC-1 — Persistencia: `localStorage` directo con puerto async

**Decisión**: usar `window.localStorage` directamente desde
`infrastructure/storage/localStorageEventStore.ts`, exponiendo un
puerto **async** aunque la impl actual sea síncrona.

**Razón**: `localStorage` soporta los 1000+ eventos esperados con
holgura (~5MB típico vs ~200 bytes/evento). API síncrona simple. El
puerto async preserva la opción de migrar a IndexedDB sin tocar use
cases ni UI.

**Alternativas descartadas**:
- `idb-keyval`: complejidad innecesaria para v1.
- Sin puerto (uso directo de `localStorage` en componentes): viola
  Clean Arch y dificulta tests.

### DEC-2 — Fechas: `date-fns` v4

**Decisión**: `date-fns@^4` + `date-fns/locale/es` para formateo
en español.

**Razón**: tree-shakable, funciones puras, ergonomía superior para
los cálculos requeridos (`eachDayOfInterval`, `isWithinInterval`,
`differenceInDays`). Locale español built-in.

**Alternativas descartadas**:
- Nativo (`Date` + `Intl`): cálculos multi-día propensos a bugs DST.
- `Temporal` polyfill: ~30KB extra y migración pendiente cuando
  llegue nativo.

### DEC-3 — Server Components vs Client

**Decisión**: shell RSC + isla cliente única.
- `app/(app)/calendar/page.tsx` es Server Component (sólo metadata
  y `<CalendarApp />` import).
- `calendarApp.tsx` y todos sus hijos en `components/` llevan
  `"use client"`.

**Razón**: la lectura de `localStorage` requiere `window`, lo que
fuerza el límite client. Minimizamos el bundle al mantener la
shell server. Multi-isla agregaría complejidad sin beneficio
medible en una sola feature.

### DEC-4 — Validación y forms

**Decisión**: Zod + `react-hook-form` + `@hookform/resolvers/zod`.
Los schemas Zod son la **fuente de verdad** y se reutilizan en:

1. El form (vía `zodResolver`).
2. El use case (parse al recibir input).
3. El parser de `localStorage` (`persistedSchema`).

**Razón**: estándar de facto en Next 15. RHF evita re-renders por
tecla. Reutilización de schemas evita duplicación de reglas.

### DEC-5 — Comportamiento ante `localStorage` no disponible (OQ-1)

**Decisión**: detectar la disponibilidad en `CalendarApp` mediante
un hook `useLocalStorageAvailability` que:

1. Retorna `null` durante SSR y antes del mount (renderiza skeleton).
2. Tras el mount, intenta `setItem(__test__, x)` + `removeItem` en
   `useEffect` y retorna `true` / `false` según resultado.
3. Si retorna `false`, `CalendarApp` renderiza
   `<LocalStorageUnavailable />` (fullscreen, mensaje en español,
   accesible) y nada más del árbol.

```tsx
// src/lib/hooks/useLocalStorageAvailability.ts
"use client";
import { useEffect, useState } from "react";
import { isLocalStorageAvailable } from "@/infrastructure/storage/localStorageAvailability";

export function useLocalStorageAvailability(): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => setAvailable(isLocalStorageAvailable()), []);
  return available;
}
```

```ts
// src/infrastructure/storage/localStorageAvailability.ts
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
```

**Razón**: simple, sin dependencias, sin redirects ni error
boundaries (que muestran UI de error técnico, no de requisito).
Cubre los 3 casos (no soportado, deshabilitado, quota llena al
write de prueba). No se reintenta automáticamente — el usuario
recarga después de habilitar.

**Alternativas descartadas**:
- Redirect a `/no-storage`: riesgo de loop, ruta extra innecesaria.
- Error boundary: UX de "algo salió mal" en vez de "falta requisito".

## 6. Manejo de errores

Todos los use cases retornan `Result<T, E>` (ver
`stack/patterns.md` § Error handling). Mapeo a UI:

| `EventStoreError.kind` | UI |
|---|---|
| `unavailable` | Renderiza `<LocalStorageUnavailable />` (R1.4). |
| `schemaUnknown` | Vista dedicada con mensaje "Datos guardados en formato desconocido. Recarga después de actualizar el navegador o contacta al soporte." (R1.3). No sobrescribe storage. |
| `corruptedStorage` | Idem `schemaUnknown` con mensaje "Los datos del calendario están dañados." |
| `quotaExceeded` | Toast con `sonner`: "No se pudo guardar el cambio. El almacenamiento del navegador está lleno." El cambio no se persiste; el estado en memoria se rolea atrás. |
| `notFound` (en delete/edit) | Toast: "El evento ya no existe. Recarga el calendario." |

Errores no contemplados (no debería ocurrir): se loguean con
`pino` (`logger.error`) y se muestra toast genérico.

## 7. Accessibility (concreto)

### Grid mensual

- Semántica: `<table role="grid">` con `<thead>` para días de la
  semana y `<tbody>` con `<tr role="row">` y `<td role="gridcell">`.
- Navegación con flechas (Arrow Up/Down/Left/Right mueve entre
  celdas), `Home`/`End` al inicio/fin de semana, `PageUp`/`PageDown`
  al mes anterior/siguiente.
- `aria-current="date"` en el día de hoy.
- `aria-selected="true"` en el día seleccionado para el `dayPanel`.

### Modales (crear/editar/borrar)

- shadcn `<Dialog>` y `<AlertDialog>` ya manejan focus trap, `Escape`
  y devolución de foco al trigger.
- El primer input editable recibe foco al abrir.
- `aria-describedby` enlaza el mensaje de error de cada campo.

### Vista bloqueada (R1.4)

- `<main role="main">` con `<h1>` con el título del bloqueo y `<p>`
  con la instrucción. Foco inicial en el `<h1>`.
- Sin controles activos en el árbol (el resto no se renderiza).
- Contraste mínimo 4.5:1 (verificado por axe-core).

### Live regions

- `<div role="status" aria-live="polite">` anuncia cambios de mes
  ("Mostrando junio 2026") y resultado de mutaciones ("Evento creado",
  "Evento eliminado").

### Validación a11y

`tests/e2e/keyboardA11y.spec.ts` ejercita los 4 flujos críticos
sólo con teclado y corre `injectAxe` + `checkA11y` en cada estado
intermedio.

## 8. Tests por requirement

| R*.* | Tipo(s) | Archivo(s) |
|---|---|---|
| R1.1 | unit, integration | `tests/unit/infrastructure/storage/localStorageEventStore.test.ts`, `tests/integration/persistence.test.ts` |
| R1.2 | unit, e2e | `tests/unit/application/events/listEvents.test.ts`, `tests/e2e/monthNavigation.spec.ts` (estado vacío) |
| R1.3 | unit | `tests/unit/domain/events/schemas.test.ts` (sección `persistedSchema`) |
| R1.4 | unit, e2e, a11y | `tests/unit/infrastructure/storage/localStorageAvailability.test.ts`, `tests/e2e/localStorageBlock.spec.ts` |
| R2.1 | e2e, a11y | `tests/e2e/monthNavigation.spec.ts` |
| R2.2 | e2e | `tests/e2e/dayPanel.spec.ts` |
| R2.3 | e2e, a11y | `tests/e2e/monthNavigation.spec.ts` (teclado, botones) |
| R2.4 | unit, e2e | `tests/unit/domain/events/eventInDay.test.ts`, `tests/e2e/multiDayDisplay.spec.ts` |
| R3.1 | unit, e2e | `tests/unit/domain/events/eventKind.test.ts`, `tests/e2e/createSingleDayTimed.spec.ts` |
| R3.2 | unit, e2e | `tests/unit/domain/events/eventKind.test.ts`, `tests/e2e/createSingleDayAllDay.spec.ts` |
| R3.3 | unit, e2e | `tests/unit/domain/events/eventKind.test.ts`, `tests/e2e/createMultiDayAllDay.spec.ts` |
| R3.4 | unit, e2e | `tests/unit/domain/events/eventKind.test.ts`, `tests/e2e/createMultiDayTimed.spec.ts` |
| R3.5 | unit, e2e | `tests/unit/domain/events/schemas.test.ts`, `tests/e2e/validations.spec.ts` |
| R3.6 | unit, e2e | `tests/unit/domain/events/schemas.test.ts`, `tests/e2e/validations.spec.ts` |
| R4.1 | unit, e2e | `tests/unit/application/events/editEvent.test.ts`, `tests/e2e/editAndDelete.spec.ts` |
| R4.2 | unit, e2e | `tests/unit/application/events/deleteEvent.test.ts`, `tests/e2e/editAndDelete.spec.ts` |
| R4.3 | unit, e2e | `tests/unit/application/events/toggleEventStatus.test.ts`, `tests/e2e/toggleStatus.spec.ts` |
| R5.1 | a11y, e2e | axe en cada test e2e + `tests/e2e/keyboardA11y.spec.ts` |
| R5.2 | a11y, e2e | `tests/e2e/keyboardA11y.spec.ts` |

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **Cuota llena durante uso normal** (1MB+ de eventos). | Cota teórica muy lejana (~5000 eventos sería ~1MB). En la práctica si ocurre, `quotaExceeded` se mapea a toast y el cambio se rolea atrás. |
| **jsdom no implementa `crypto.randomUUID` en versiones viejas**. | Pinear `vitest@^2` y `jsdom@^25`. Si surge, fallback a `import { v4 } from "uuid"` en tests. |
| **React 19 + Next 15 son recientes** — APIs experimentales pueden cambiar. | Versiones pineadas en `package.json` (ver `stack/tech-stack.md` § Versiones congeladas). Subir de versión vía PR dedicado, no automático. |
| **`localStorage` y SSR**: `window` no existe en server, ejecutar el detector ahí crashea. | Hook arranca con `null`, evalúa sólo en `useEffect`. `isLocalStorageAvailable` chequea `typeof window === "undefined"` antes de tocar storage. |
| **Date-fns y DST en eventos multi-día**: cálculos pueden saltar horas. | Trabajar siempre con strings locales (`YYYY-MM-DD[THH:mm]`) sin Date intermedio para comparaciones. `Date` sólo para `format` con `date-fns`. |
| **Tests E2E lentos por levantar Next**. | `playwright.config.ts` cachea `webServer` entre runs locales. CI usa una sola instancia para toda la suite. |

## 10. Aprobación

- **G3 (Plan / Design)**: pendiente firma del tech lead. **Sin
  bloqueantes** — todos los DEC-N están definidos, todos los TODO
  resueltos, tests por R*.* mapeados a archivos.
- **Tras G3**: poblar `tasks.md` con T1..TN en orden de dependencias
  (domain → application → infrastructure → composition root → UI →
  tests). Recién entonces invocar `/spec-implement`.
