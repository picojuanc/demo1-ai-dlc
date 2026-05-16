---
description: Clasificar un bug en la taxonomía A/B/C/D/E (§8) con entrevista
---

Sigue el protocolo §7 (AGENTS.md). Para el bug descrito en $ARGUMENTS:

1. **CONTEXT** — verificar:
   - ¿En qué feature/spec aparece?
   - ¿Hay repro estable o es intermitente?
   - ¿Ya hay `BUG-NNN` abierto en `bugs.md` con síntomas similares?

2. **CLARIFY** — entrevistar al reportero:
   - ¿Qué se esperaba? ¿Qué pasó?
   - ¿La spec cubre este caso explícitamente? (cita `R*.*`).
   - ¿Es un cambio externo (cliente, ley) o un defecto técnico?
   - ¿La dependencia involucrada es 3rd party (paquete / SaaS)?

3. **PROPOSE** clasificación:
   - **A** — la spec cubre el caso y el código está mal. Regression
     test + fix. **No tocar spec.**
   - **B** — la spec NO cubre el caso (gap; abrir PR de spec antes del
     fix). Nuevo `R*.*` en `requirements.md`.
   - **C** — la spec lo cubre pero es ambigua. Refinar `requirements.md`
     + posible fix.
   - **D** — incidente en prod con SLA roto. Hotfix directo + spec
     retroactiva en post-mortem.
   - **E** — causa raíz es un paquete / SaaS 3rd party. Reportar al
     vendor. Estrategia: `WORKAROUND` / `PIN` / `WAIT`. La `R*.*`
     afectada queda `blocked_by: ext:<id>` en `status.md`.
   - **Amendment** — no es bug; es cambio externo. Redirigir a
     `/spec-amend` (no contaminar la métrica de Tipo B).
   - Pedir confirmación al reportero.

4. **EXECUTE** — registrar en `bugs.md` (formato §8 Tracking):
   - `BUG-NNN`, tipo, requirement afectado, fecha, reportero.
   - Para Tipo B / C: abrir PR de spec antes del fix.
   - Para Tipo E: marcar `blocked_by: ext:<id>` en `status.md` mientras
     se espera al vendor.

5. **CLOSE** — siguiente paso sugerido (PR de spec, fix directo,
   workaround, escalación a vendor, etc.).
