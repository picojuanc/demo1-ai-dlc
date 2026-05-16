# Tasks — events-calendar

> **Feature**: `events-calendar`
> **Base**: `requirements.md` (G2 ✅ commit `1d43491`) +
> `design.md` (G3 partial commit `c0fd6b7`).
>
> Convenciones obligatorias (§6 methodology, `stack/patterns.md`):
>
> - Orden **estricto**: T1 antes que T2; las bloqueadas se resuelven
>   antes de avanzar.
> - Cada task referencia los `R*.*` que cubre y los **archivos**
>   tocados.
> - Cada commit cita su task y sus `R*.*`:
>   `feat(demo1-ai-dlc): T<n> - <desc> [R<x>.<y>]`
>   (este repo opera sin work item de ADO; el sufijo `AB#` se omite).
> - Cada test del código generado lleva `// Derived from R<x>.<y>`.
> - El status de cada task se refleja en `status.md` tras cada commit.

## Orden y dependencias

```
T1 (bootstrap)
 └─► T2 (observability)
      └─► T3 (domain)
           └─► T4 (application + ports)
                └─► T5 (infrastructure/storage)
                     └─► T6 (composition + hook)
                          └─► T7 (UI shell + R1.4)
                               ├─► T8 (UI month grid)
                               │    └─► T9 (UI day panel)
                               │         └─► T10 (UI forms)
                               │              ├─► T11..T15 (E2E)
                               │              │
                               │              └─► T16 (coverage close)
```

## T1..T16

### T1 — Bootstrap del proyecto

Inicializar el proyecto Next 15 + TS estricto + pnpm + ecosistema
mínimo de tooling.

- **Cubre**: ninguna `R*.*` directamente; habilita todos.
- **Archivos**:
  - `package.json`, `pnpm-lock.yaml`, `tsconfig.json`,
    `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`,
    `.prettierrc`, `eslint.config.mjs`, `.husky/pre-commit`,
    `lint-staged.config.mjs`, `vitest.config.ts`,
    `playwright.config.ts`, `instrumentation.ts`.
  - `src/app/layout.tsx`, `src/app/page.tsx` (placeholder), `src/app/globals.css`.
  - `src/components/ui/` con los componentes shadcn enumerados en
    `design.md` §4.2.
  - `.env.example`.
- **Comandos clave**:
  - `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-pnpm --no-import-alias` (con alias `@/*` configurado a mano si el flag falla).
  - `pnpm dlx shadcn@latest init` y `pnpm dlx shadcn@latest add button input label checkbox dialog alert-dialog dropdown-menu form sonner card`.
- **Tests**: ninguno aún; `pnpm build` y `pnpm lint` deben pasar en
  verde.
- **Bloquea**: T2..T16.

### T2 — Observabilidad mínima

Logger estructurado y boilerplate de OpenTelemetry (sin exporter
real hasta tener deploy target).

- **Cubre**: ninguna `R*.*` directamente; pre-requisito de
  `stack/tech-stack.md` § Observabilidad.
- **Archivos**:
  - `src/infrastructure/observability/logger.ts` (pino con campos
    obligatorios de `stack/patterns.md` § Logging).
  - `src/instrumentation.ts` (registro OTel; placeholder si no hay
    collector).
- **Tests**: unit smoke test del logger (que produce JSON con los
  campos requeridos).
- **Bloqueada por**: T1.

### T3 — Domain de eventos

Entidades, schemas Zod y helpers de fechas.

- **Cubre**:
  - R1.3 (schema persistido versionado, validación al leer).
  - R3.5, R3.6 (reglas de validación de título y orden).
  - Helpers para R2.1, R2.4, R3.1–R3.4 (clasificación de `kind`).
- **Archivos**:
  - `src/domain/events/entities.ts`
  - `src/domain/events/valueObjects.ts`
  - `src/domain/events/schemas.ts`
  - `src/domain/events/helpers.ts`
  - `src/domain/events/errors.ts`
- **Tests**:
  - `tests/unit/domain/events/schemas.test.ts` (R1.3, R3.5, R3.6).
  - `tests/unit/domain/events/eventKind.test.ts` (R3.1–R3.4).
  - `tests/unit/domain/events/eventInDay.test.ts` (R2.4).
  - `tests/unit/domain/events/eventsInRange.test.ts` (R2.1).
- **Bloqueada por**: T2.

### T4 — Application (puerto + use cases)

Puerto `EventStore` y los 5 use cases que orquestan dominio.

- **Cubre**:
  - R1.1 (persistir cambios — el use case llama al puerto).
  - R1.2 (carga inicial — `listEvents`).
  - R3.1–R3.6 (createEvent valida y construye Event).
  - R4.1 (editEvent).
  - R4.2 (deleteEvent).
  - R4.3 (toggleEventStatus).
- **Archivos**:
  - `src/application/events/ports/eventStore.ts`
  - `src/application/events/useCases/createEvent.ts`
  - `src/application/events/useCases/editEvent.ts`
  - `src/application/events/useCases/deleteEvent.ts`
  - `src/application/events/useCases/toggleEventStatus.ts`
  - `src/application/events/useCases/listEvents.ts`
  - `src/shared/result.ts` (si no se creó en T1).
- **Tests**: un archivo por use case bajo
  `tests/unit/application/events/`, mockeando `EventStore` con
  un fake en memoria. Cada test con `// Derived from R<x>.<y>`.
- **Bloqueada por**: T3.

### T5 — Infrastructure: storage

Implementación del puerto `EventStore` con `localStorage` y la
función de disponibilidad.

- **Cubre**:
  - R1.1 (persistencia real).
  - R1.2 (lectura inicial).
  - R1.3 (validación con `persistedSchema`).
  - R1.4 (detección de disponibilidad).
- **Archivos**:
  - `src/infrastructure/storage/localStorageAvailability.ts`
  - `src/infrastructure/storage/localStorageEventStore.ts`
- **Tests**:
  - `tests/unit/infrastructure/storage/localStorageAvailability.test.ts`
    (R1.4) — incluye casos: `window === undefined`, setItem que
    tira, removeItem que tira.
  - `tests/unit/infrastructure/storage/localStorageEventStore.test.ts`
    (R1.1, R1.3) — incluye QuotaExceededError simulado.
  - `tests/integration/persistence.test.ts` (R1.1 + R1.2 round-trip
    en jsdom).
- **Bloqueada por**: T4.

### T6 — Composition root + hook de disponibilidad

Wiring del puerto a la impl y hook que la app consume.

- **Cubre**: R1.4 (consumo en cliente).
- **Archivos**:
  - `src/composition.ts` — factory `getEventStore()`.
  - `src/lib/hooks/useLocalStorageAvailability.ts`.
- **Tests**: unit del hook con `@testing-library/react` + jsdom
  (estado `null` → `true|false`).
- **Bloqueada por**: T5.

### T7 — UI shell + bloqueo R1.4

Punto de entrada de la feature y la vista de bloqueo.

- **Cubre**: R1.4 (UI), R5.1 (a11y de la vista de bloqueo).
- **Archivos**:
  - `src/app/(app)/calendar/page.tsx` (RSC, metadata "Calendario").
  - `src/app/(app)/calendar/calendarApp.tsx` (`'use client'`).
  - `src/app/(app)/calendar/components/localStorageUnavailable.tsx`.
- **Tests**: cubierto por E2E T14; sin unit tests específicos del
  RSC shell.
- **Bloqueada por**: T6.

### T8 — UI: vista mensual

Grilla del mes con encabezado de navegación y rendering de eventos
multi-día.

- **Cubre**: R2.1, R2.3, R2.4, R5.1, R5.2 (navegación con teclado).
- **Archivos**:
  - `src/app/(app)/calendar/components/monthHeader.tsx` (botones
    anterior / siguiente / hoy + título del mes en español).
  - `src/app/(app)/calendar/components/monthGrid.tsx`
    (`<table role="grid">`, celdas con eventos visibles).
- **Tests**: cubierto por E2E T13 y T15.
- **Bloqueada por**: T7.

### T9 — UI: panel del día

Lista de eventos del día seleccionado.

- **Cubre**: R2.2, R4.3 (toggle desde la lista), R5.1, R5.2.
- **Archivos**:
  - `src/app/(app)/calendar/components/dayPanel.tsx` (panel lateral
    o sección inferior con la lista).
  - `src/app/(app)/calendar/components/eventRow.tsx` (con dropdown
    de acciones edit/delete y checkbox de done).
- **Tests**: cubierto por E2E T11–T13.
- **Bloqueada por**: T8.

### T10 — UI: formularios crear/editar/borrar

Modales para mutaciones.

- **Cubre**: R3.1–R3.6, R4.1, R4.2, R5.1, R5.2.
- **Archivos**:
  - `src/app/(app)/calendar/components/eventFormDialog.tsx`
    (RHF + zodResolver + `eventFormSchema`).
  - `src/app/(app)/calendar/components/deleteEventDialog.tsx`
    (shadcn `AlertDialog`).
- **Tests**: cubierto por E2E T11 (crear) y T12 (editar / borrar).
- **Bloqueada por**: T9.

### T11 — E2E: creación de eventos (4 tipos)

- **Cubre**: R3.1, R3.2, R3.3, R3.4.
- **Archivos**:
  - `tests/e2e/createSingleDayTimed.spec.ts`
  - `tests/e2e/createSingleDayAllDay.spec.ts`
  - `tests/e2e/createMultiDayAllDay.spec.ts`
  - `tests/e2e/createMultiDayTimed.spec.ts`
- **Bloqueada por**: T10.

### T12 — E2E: editar, borrar, toggle, validaciones

- **Cubre**: R3.5, R3.6, R4.1, R4.2, R4.3.
- **Archivos**:
  - `tests/e2e/validations.spec.ts`
  - `tests/e2e/editAndDelete.spec.ts`
  - `tests/e2e/toggleStatus.spec.ts`
- **Bloqueada por**: T10.

### T13 — E2E: navegación mensual + panel del día + multi-día

- **Cubre**: R2.1, R2.2, R2.3, R2.4.
- **Archivos**:
  - `tests/e2e/monthNavigation.spec.ts`
  - `tests/e2e/dayPanel.spec.ts`
  - `tests/e2e/multiDayDisplay.spec.ts`
- **Bloqueada por**: T10.

### T14 — E2E: bloqueo R1.4

Simula `localStorage` indisponible en Playwright (override del
contexto del browser) y verifica que se muestra
`<LocalStorageUnavailable />`.

- **Cubre**: R1.4 (UI + a11y).
- **Archivos**:
  - `tests/e2e/localStorageBlock.spec.ts`
- **Bloqueada por**: T7.

### T15 — E2E: accessibility (teclado + axe)

- **Cubre**: R5.1, R5.2 (transversal a R2–R4).
- **Archivos**:
  - `tests/e2e/keyboardA11y.spec.ts` (un solo archivo con suite
    completa por flujo).
- **Bloqueada por**: T10. (axe se inyecta también en T11–T14;
  este archivo concentra los tests de teclado puro.)

### T16 — Verificación final de cobertura + cierre

- **Cubre**: cumplir umbrales de `stack/testing.md` (80 % global,
  ≥ 90 % en `domain/` y `application/`).
- **Archivos**:
  - Ajustes puntuales en tests si la cobertura no llega.
  - `specs/events-calendar/rollout-plan.md` (esqueleto inicial para
    G5/G6 futuros, opcional v1).
- **Tests**: la propia ejecución completa de la suite + reporte.
- **Bloqueada por**: T15 (y todas las anteriores).

## Resumen

- **Bloque dominio**: T3 (independent una vez setup).
- **Bloque application**: T4.
- **Bloque infraestructura**: T5.
- **Bloque composición**: T6.
- **Bloque UI**: T7 → T8 → T9 → T10.
- **Bloque tests E2E**: T11..T15 en paralelo en cuanto T10 cierre
  (T14 puede arrancar antes, depende sólo de T7).
- **Cierre**: T16.
