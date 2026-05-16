---
description: Resumen legible del estado de la feature (read-only)
---

Para feature $ARGUMENTS, leer (sin modificar nada):

- `requirements.md` → contar `R*.*` totales, agrupar por estado.
- `tasks.md` + `status.md` → done / in-progress / pending / blocked
  (con causa).
- `bugs.md` → bugs abiertos por tipo (A/B/C/D/E).
- (si existe) `amendments.md` → últimos `AMD-NNN` (cambios
  post-aprobación) y `HANDOFF-NNN` (eventos de ownership).
- Sección `Dependencies` de `requirements.md` → `D-N` y su estado (§6
  del methodology).
- Última ejecución de tests por nivel (unit / integration / e2e /
  contract / load) con cuántos `R*.*` cubre cada nivel.

Producir un resumen humano con:

- Progreso global de `R*.*` (implementadas / pendientes / bloqueadas).
- Tasks completadas vs pendientes vs bloqueadas y causa.
- Cobertura de tests **por nivel** (no sólo global).
- Bugs abiertos con su tipo.
- Amendments recientes.
- **Siguiente paso sugerido** — qué task arrancar o desbloquear.

Pensado para retomar trabajo tras una pausa (límite de tokens, fin de
jornada, handoff a otro dev, etc.). NO escribe nada.
