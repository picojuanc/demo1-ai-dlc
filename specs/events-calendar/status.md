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

- **state**: `spec-approved`
- **fase**: spec firmada — listo para entrevista de `design.md` (G3)

> Valores válidos del lifecycle (§6 methodology):
> `not-started` → `spec-in-review` → `spec-approved` →
> `design-in-review` → `design-approved` → `in-progress` →
> `partial-deploy-pruebas` → `partial-deploy-qa` →
> `feature-complete` → `rolled-out` → `closed`.

## Gates

| Gate | Descripción | Firmante | Estado |
|---|---|---|---|
| G2 | Feature spec (`requirements.md`) | tech lead | ✅ signed 2026-05-16 by jpico@syc.com.co (commit 1d43491) |
| G3 | Plan / Design (`design.md` + `tasks.md`) | tech lead | pending |
| G4 | PR de código | 1+ reviewer del equipo | pending |
| G5 | Pre-deploy a prod | Ops | pending |
| G6 | Rollout | Ops + tech lead | pending |
| G7 | Bug triage (post-rollout) | tech lead | N/A hasta rollout |

## OPEN_QUESTIONs activas

_Ninguna._

### Historial

- **OQ-1** — Resuelta 2026-05-16 con opción (a). Materializada en
  R1.4 (`requirements.md`).

## Tasks

_No hay tasks todavía. Se poblarán tras la firma de `design.md` (G3)._

| ID | Subject | Status | Commits | R*.* |
|---|---|---|---|---|
| — | — | — | — | — |

## Lifecycle log

| Fecha | Evento | Detalle |
|---|---|---|
| 2026-05-16 | feature creada | `/spec-new events-calendar` ejecutado. Worktree `feat/events-calendar` creado desde `origin/pruebas`. `requirements.md` y `design.md` (esqueleto) escritos. |
| 2026-05-16 | OQ-1 resuelta | Opción (a) — bloquear app y mostrar mensaje. Materializada en R1.4. G2 desbloqueado. |
| 2026-05-16 | G2 firmado | requirements.md aprobado por jpico@syc.com.co sobre commit 1d43491. state → spec-approved. |

## Próximo paso sugerido

1. Iniciar entrevista de `design.md`: completar DEC-1..DEC-4 y
   detalles pendientes de DEC-5 (componente `LocalStorageUnavailable`,
   ubicación de la detección).
2. Tras `design.md` completo, poblar `tasks.md` (T1..TN) en orden de
   dependencias y firmar **G3**.

## Notas

- Esta feature **no toca otros servicios** (sin `D-N`), **no requiere
  Architect Agent**.
- La persistencia en `localStorage` mantiene el servidor stateless
  según `stack/tech-stack.md`.
- Las secciones de auth de `stack/security.md` no aplican a esta
  feature (no hay JWT, no hay rutas protegidas).
