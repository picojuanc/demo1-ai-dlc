---
description: Transferir ownership de una feature a otro dev (rotación, baja)
---

Sigue el protocolo §7 (AGENTS.md). Para feature $FEATURE con destino
$NEW_OWNER:

1. **CONTEXT** — leer `requirements.md`, `status.md`, `amendments.md`,
   `bugs.md`, commits recientes del worktree y `OPEN_QUESTIONS`.

2. **CLARIFY** — preguntar:
   - ¿Es handoff **total** (cambio de owner) o **parcial** (cubrir
     vacaciones, ayuda temporal)?
   - ¿El dev saliente sigue accesible para preguntas o es baja
     definitiva?
   - ¿Hay conversaciones abiertas (chat / email / call) con el equipo
     proveedor de alguna `D-N` que sólo el dev saliente conocía? ¿En
     qué canal?

3. **GENERATE RESUMEN** — producir resumen ejecutable para $NEW_OWNER
   (mostrar primero, NO escribir aún):
   - Problema y motivación (de `requirements.md`).
   - Estado actual: tasks done / in-progress / blocked y por qué (de
     `status.md` y derivación del Lifecycle).
   - `D-N` activas: estado, contrato vigente, owner del otro lado,
     último contacto conocido, riesgo si el dev saliente era el único
     interlocutor.
   - Bugs abiertos.
   - Amendments aplicados (qué cambió y por qué).
   - **Pre-flight check obvio**: qué task arrancaría yo ahora.
   - `OPEN_QUESTIONS` pendientes con owner / due.
   - Riesgos y "cosas a mirar primero".

4. **EXECUTE** — tras OK del dev saliente y, si está accesible, del
   $NEW_OWNER:
   - Actualizar `owner:` en frontmatter de `requirements.md`.
   - Re-asignar work items en ADO
     (`az boards work-item update --assigned-to`).
   - Anotar el evento en `amendments.md` como entrada especial con
     prefijo `HANDOFF-NNN`:

     ```
     ## HANDOFF-001 — <fecha>
     - **Tipo**: total | parcial
     - **De**: @<saliente>
     - **A**: @<entrante>
     - **Motivo**: <rotación | baja | vacaciones | ayuda>
     - **Conversaciones a re-abrir**: D1 (canal X), D3 (email a Y)
     - **Resumen handoff**: <link al doc del paso 3>
     ```

   - `D-N` cuyo `Tracking:` apuntaba a una conversación personal del
     saliente: marcar como `NEGOTIATING-stale` (§6 SLAs) y proponer
     reabrir el contacto desde $NEW_OWNER.

5. **CLOSE** — entregar a $NEW_OWNER:
   - Path del worktree.
   - Link al resumen del paso 3.
   - **Acciones inmediatas sugeridas**: leer requirements + design,
     correr `/spec-status`, reabrir `D-N` stale, decidir si seguir o
     `cancelled`.
   - Confirmación: el dev saliente puede ejecutar `git worktree remove`
     tras OK explícito del entrante (§3.16).

Un handoff **NO** es un Amendment ni un bug — es un evento de
ownership. El prefijo `HANDOFF-` en `amendments.md` lo distingue de
`AMD-` (Amendments) y no contamina las métricas de ninguno.
