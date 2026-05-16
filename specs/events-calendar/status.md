# Status — events-calendar

> Source of truth del lifecycle (§6 methodology). Actualizar tras cada
> task `done` y tras cada gate firmado. `/spec-status` lee este archivo.

## Identidad

- **Feature**: `events-calendar`
- **Servicio**: `demo1-ai-dlc`
- **Initiative**: NONE
- **Owner**: PENTAI (lead: Juan Pico — `jpico@syc.com.co`)
- **Branch**: `feat/events-calendar` (worktree:
  `/Users/picojuanc/Downloads/demo1-ai-dlc--events-calendar`)
- **Base**: `pruebas`

## State

- **state**: `in-progress`
- **fase**: ejecución de tasks. T1–T4 done; T5 en cola.

> Valores válidos del lifecycle (§6 methodology):
> `not-started` → `spec-in-review` → `spec-approved` →
> `design-in-review` → `design-approved` → `in-progress` →
> `partial-deploy-pruebas` → `partial-deploy-qa` →
> `feature-complete` → `rolled-out` → `closed`.

## Gates

| Gate | Descripción                              | Firmante               | Estado                                                                    |
| ---- | ---------------------------------------- | ---------------------- | ------------------------------------------------------------------------- |
| G2   | Feature spec (`requirements.md`)         | tech lead              | ✅ signed 2026-05-16 by jpico@syc.com.co (commit 1d43491)                 |
| G3   | Plan / Design (`design.md` + `tasks.md`) | tech lead              | ✅ signed 2026-05-16 by jpico@syc.com.co (design c0fd6b7 + tasks 20ff8f7) |
| G4   | PR de código                             | 1+ reviewer del equipo | pending                                                                   |
| G5   | Pre-deploy a prod                        | Ops                    | pending                                                                   |
| G6   | Rollout                                  | Ops + tech lead        | pending                                                                   |
| G7   | Bug triage (post-rollout)                | tech lead              | N/A hasta rollout                                                         |

## OPEN_QUESTIONs activas

_Ninguna._

### Historial

- **OQ-1** — Resuelta 2026-05-16 con opción (a). Materializada en
  R1.4 (`requirements.md`).

## Tasks

| ID  | Subject                                                                | Status  | Commits | R*.*                                    |
| --- | ---------------------------------------------------------------------- | ------- | ------- | --------------------------------------- |
| T1  | Bootstrap del proyecto (Next 15 + TS + Tailwind + shadcn + tooling)    | ✅ done | da7024c | —                                       |
| T2  | Observabilidad mínima (pino + OTel skeleton)                           | ✅ done | 8a7e019 | —                                       |
| T3  | Domain de eventos (entidades, schemas, helpers + tests)                | ✅ done | 0ee4205 | R1.3, R3.5, R3.6, R2.1, R2.4, R3.1–R3.4 |
| T4  | Application (puerto EventStore + 5 use cases + tests)                  | ✅ done | 312800d | R1.1, R1.2, R3.1–R3.6, R4.1–R4.3        |
| T5  | Infrastructure storage (availability + localStorageEventStore + tests) | pending | —       | R1.1, R1.2, R1.3, R1.4                  |
| T6  | Composition root + useLocalStorageAvailability                         | pending | —       | R1.4                                    |
| T7  | UI shell + componente bloqueo R1.4                                     | pending | —       | R1.4, R5.1                              |
| T8  | UI vista mensual (monthHeader + monthGrid)                             | pending | —       | R2.1, R2.3, R2.4, R5.1, R5.2            |
| T9  | UI panel del día (dayPanel + eventRow)                                 | pending | —       | R2.2, R4.3, R5.1, R5.2                  |
| T10 | UI formularios (eventFormDialog + deleteEventDialog)                   | pending | —       | R3.x, R4.1, R4.2, R5.1, R5.2            |
| T11 | E2E creación 4 tipos                                                   | pending | —       | R3.1–R3.4                               |
| T12 | E2E editar, borrar, toggle, validaciones                               | pending | —       | R3.5, R3.6, R4.1–R4.3                   |
| T13 | E2E navegación + panel + multi-día                                     | pending | —       | R2.1–R2.4                               |
| T14 | E2E bloqueo R1.4                                                       | pending | —       | R1.4                                    |
| T15 | E2E accessibility (teclado + axe)                                      | pending | —       | R5.1, R5.2                              |
| T16 | Cierre de cobertura                                                    | pending | —       | (transversal)                           |

## Lifecycle log

| Fecha      | Evento                    | Detalle                                                                                                                                                                                                                                                                                              |
| ---------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-16 | feature creada            | `/spec-new events-calendar` ejecutado. Worktree `feat/events-calendar` creado desde `origin/pruebas`. `requirements.md` y `design.md` (esqueleto) escritos.                                                                                                                                          |
| 2026-05-16 | OQ-1 resuelta             | Opción (a) — bloquear app y mostrar mensaje. Materializada en R1.4. G2 desbloqueado.                                                                                                                                                                                                                 |
| 2026-05-16 | G2 firmado                | requirements.md aprobado por jpico@syc.com.co sobre commit 1d43491. state → spec-approved.                                                                                                                                                                                                           |
| 2026-05-16 | design.md completo        | DEC-1..DEC-5 cerrados en entrevista. Tabla de tests por R*.* mapeada a archivos. G3 ready for sign.                                                                                                                                                                                                  |
| 2026-05-16 | G3 firma parcial (design) | design.md aprobado por jpico@syc.com.co sobre commit c0fd6b7. State **NO** avanza hasta poblar tasks.md y re-firmar.                                                                                                                                                                                 |
| 2026-05-16 | tasks.md completo         | T1..T16 en orden estricto, mapeados a R*.* y archivos. commit 20ff8f7.                                                                                                                                                                                                                               |
| 2026-05-16 | G3 firma completa         | design + tasks aprobados. state → design-approved. Habilita `/spec-implement` T1.                                                                                                                                                                                                                    |
| 2026-05-16 | T1 done                   | Bootstrap Next 15 + Tailwind + shadcn config + ESLint/Prettier/Husky + Vitest/Playwright. build/lint/typecheck/test verde. commit da7024c. state → in-progress.                                                                                                                                      |
| 2026-05-16 | T2 done                   | Logger pino con service=demo1-ai-dlc y redact; instrumentation.ts placeholder de OTel. commit 8a7e019.                                                                                                                                                                                               |
| 2026-05-16 | T3 done                   | Domain events: entities, value objects, schemas Zod, helpers (eventKind, eventInDay, eventDays, eventsInRange), errors. 29 tests nuevos (31/31 total). commit 0ee4205.                                                                                                                               |
| 2026-05-16 | T4 done                   | Application: puerto `EventStore` async + use cases `createEvent`/`editEvent`/`deleteEvent`/`toggleEventStatus`/`listEvents` con factories DI (clock, newId). Helper `_validation` mapea Zod issues a `EventValidationError`. 19 tests nuevos con fake in-memory store (50/50 total). commit 312800d. |

## Próximo paso sugerido

`/spec-implement` para arrancar **T5** (Infrastructure: storage —
`localStorageAvailability` + `localStorageEventStore` + tests unit e
integration). Cubre R1.1, R1.2, R1.3, R1.4 con persistencia real.
Cada task sigue el flujo:

1. Marcar la task como `in-progress` en este `status.md`.
2. Implementar los archivos declarados, con tests citando `R*.*`.
3. Commit con formato `feat|fix|chore(demo1-ai-dlc): T<n> - <desc> [R*.*]`.
4. Marcar la task como `done` en este `status.md` con el hash del commit.
5. Pasar a la siguiente task respetando el orden estricto.

## Notas

- Esta feature **no toca otros servicios** (sin `D-N`), **no requiere
  Architect Agent**.
- La persistencia en `localStorage` mantiene el servidor stateless
  según `stack/tech-stack.md`.
- Las secciones de auth de `stack/security.md` no aplican a esta
  feature (no hay JWT, no hay rutas protegidas).
