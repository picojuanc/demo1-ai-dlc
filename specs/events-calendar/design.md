# Design — events-calendar

> **Estado**: esqueleto. Se llena después de aprobar `requirements.md`
> y resolver **OQ-1**. NO escribir código hasta que este documento esté
> firmado (G3).

## 1. Arquitectura

> Aplicar `stack/architecture.md` (Clean Architecture) adaptado al
> caso 100% client-side.

- TODO — Diagrama de capas para esta feature.
- TODO — Justificación de por qué Clean Arch igual aplica aunque no
  haya backend de datos (puerto `EventStore` permite cambiar
  persistencia sin tocar use cases).

## 2. Estructura de archivos (esta feature)

```
src/
├── app/
│   └── (app)/
│       └── calendar/
│           ├── page.tsx        # TODO — vista mensual (Server Component shell + Client island)
│           └── components/     # TODO — listar componentes específicos
│
├── domain/
│   └── events/
│       ├── entities.ts         # TODO — Event, EventId, EventStatus
│       ├── value-objects.ts    # TODO — DateRange, EventKind
│       └── errors.ts           # TODO — EventValidationError
│
├── application/
│   └── events/
│       ├── use-cases/
│       │   ├── createEvent.ts  # TODO
│       │   ├── editEvent.ts    # TODO
│       │   ├── deleteEvent.ts  # TODO
│       │   ├── toggleStatus.ts # TODO
│       │   └── listEvents.ts   # TODO
│       └── ports/
│           └── eventStore.ts   # TODO — interface
│
└── infrastructure/
    └── storage/
        └── localStorageEventStore.ts  # TODO — implementación del puerto
```

## 3. Modelo de datos

### 3.1 `Event` (entidad de dominio)

- TODO — Definir interface/tipo: `id`, `title`, `kind`, `start`,
  `end`, `status`.
- TODO — Decidir si `kind` es enum unión (`'single-day-timed' |
  'single-day-allday' | 'multi-day-allday' | 'multi-day-timed'`)
  o si se infiere de la presencia de horas + comparación de fechas.

### 3.2 Schema persistido en `localStorage`

- TODO — Key: `dad_events_v1` (propuesta).
- TODO — Schema Zod para validación al leer:
  `{ version: 1, events: Event[] }`.
- TODO — DEC sobre migraciones futuras.

### 3.3 IDs

- TODO — Decidir entre `crypto.randomUUID()` (Web Crypto API, soporte
  amplio) vs ULID. Propuesta: `crypto.randomUUID()`.

## 4. Contratos / interfaces internas

### 4.1 Puerto `EventStore`

```ts
// TODO — esqueleto en application/events/ports/eventStore.ts
interface EventStore {
  list(): Promise<Result<Event[], EventStoreError>>;
  save(event: Event): Promise<Result<void, EventStoreError>>;
  delete(id: EventId): Promise<Result<void, EventStoreError>>;
}
```

- TODO — Decidir si métodos son sync (localStorage lo es) o async
  (forward-compatible si se introduce IndexedDB).

### 4.2 UI components (shadcn)

- TODO — Lista de componentes a instalar con `pnpm dlx shadcn add`:
  `calendar`, `dialog`, `button`, `input`, `label`, `checkbox`,
  `alert-dialog` (confirmación de borrado), `dropdown-menu`.

## 5. Decisiones arquitectónicas (DEC-N)

- TODO **DEC-1** — Persistencia: `localStorage` directo vs `idb-keyval`
  (envoltorio sobre IndexedDB). Decisión y razón.
- TODO **DEC-2** — Librería de fechas: nativa (`Intl.DateTimeFormat` +
  `Date`) vs `date-fns` vs `Temporal` polyfill. Recomendación inicial:
  `date-fns` por ergonomía y tree-shaking.
- TODO **DEC-3** — Cliente vs Server Components: qué partes son RSC y
  qué son `"use client"`. La lectura inicial de `localStorage` obliga a
  un Client boundary; minimizar el árbol cliente.
- TODO **DEC-4** — Validación: Zod schemas compartidos entre use case
  y formulario (`react-hook-form` + `@hookform/resolvers/zod`).
- **DEC-5** — Comportamiento ante `localStorage` no disponible
  (OQ-1 resuelta el 2026-05-16, materializada en R1.4): la app
  detecta la disponibilidad al iniciar mediante una escritura de
  prueba (`localStorage.setItem` + `removeItem`) y, ante cualquier
  fallo, renderiza una vista de bloqueo a pantalla completa con
  mensaje en español. No hay fallback en memoria. TODO definir:
  - Ubicación de la detección (probable: hook
    `useLocalStorageAvailability` en boundary cliente del root
    layout protegido, o gate dentro de `composition.ts`).
  - Componente `LocalStorageUnavailable.tsx` (texto, layout, foco
    inicial, accesibilidad).

## 6. Manejo de errores

- TODO — Mapeo de `EventStoreError` a UI: banner / toast / inline.
- TODO — Política ante schema desconocido (R1.3): no sobrescribir,
  mostrar UI dedicada con opción de descargar el contenido raw.

## 7. Accessibility (concreto)

- TODO — Estructura semántica del grid de mes (rol `grid`, `gridcell`,
  navegación por flechas).
- TODO — Foco al abrir/cerrar modal (trap focus, devolver al trigger).
- TODO — Labels y descripciones para checkbox de "todo el día" y
  toggle de estado hecho/no hecho.

## 8. Tests por requirement

> Tabla detallada que mapea cada `R*.*` a archivos de test concretos.
> Se completa antes de cerrar el design para que `/spec-verify` pueda
> auditar la cobertura desde el día uno.

| R*.* | Tipo(s) | Archivo(s) de test propuesto |
|---|---|---|
| R1.1 | unit, integration | TODO |
| R1.2 | unit, e2e | TODO |
| R1.3 | unit | TODO |
| R1.4 | unit, e2e, a11y | TODO |
| R2.1 | e2e, a11y | TODO |
| R2.2 | e2e | TODO |
| R2.3 | e2e, a11y | TODO |
| R2.4 | unit, e2e | TODO |
| R3.1–R3.4 | unit, e2e | TODO |
| R3.5–R3.6 | unit, e2e | TODO |
| R4.1–R4.3 | unit, e2e | TODO |
| R5.1–R5.2 | a11y, e2e | TODO |

## 9. Riesgos y mitigaciones

- TODO — Listar 2–3 riesgos concretos (ej. *cuota de localStorage*,
  *jsdom no implementa todas las APIs del browser para tests
  unitarios de R2.x*) y mitigación de cada uno.

## 10. Aprobación

- **G3 (Plan/Design)**: pendiente firma del tech lead.
- **Bloqueantes**: completar todos los `TODO` de §3, §4, §5
  (DEC-1..DEC-4 y los detalles pendientes de DEC-5).
- **Tras G3**: poblar `tasks.md` con T1..TN siguiendo el orden de
  dependencias (domain → application → infrastructure → ui → tests).
