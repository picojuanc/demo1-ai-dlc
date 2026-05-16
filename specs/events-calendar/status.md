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
| G3 | Plan / Design (`design.md` + `tasks.md`) | tech lead | **pending** (design listo en commit c0fd6b7; tasks.md pendiente hasta firmar G3) |
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
| 2026-05-16 | design.md completo | DEC-1..DEC-5 cerrados en entrevista. Tabla de tests por R*.* mapeada a archivos. G3 ready for sign. |

## Próximo paso sugerido

1. Firmar **G3** sobre `design.md` (commit c0fd6b7) con commit
   `sign(demo1-ai-dlc): G3 events-calendar design approved`.
2. Poblar `tasks.md` con T1..TN en orden de dependencias (domain
   → application → infrastructure → composition root → UI → tests).
3. **Re-firmar G3** sobre la versión con `tasks.md` completo, o
   tratar la firma actual como cubriendo design + tasks juntos
   (decidir antes de firmar).
4. Recién después: `/spec-implement` (T1).

## Notas

- Esta feature **no toca otros servicios** (sin `D-N`), **no requiere
  Architect Agent**.
- La persistencia en `localStorage` mantiene el servidor stateless
  según `stack/tech-stack.md`.
- Las secciones de auth de `stack/security.md` no aplican a esta
  feature (no hay JWT, no hay rutas protegidas).
