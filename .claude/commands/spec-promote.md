---
description: Abrir PR de promoción al siguiente ambiente (pruebas → qa → main)
---

Sigue el protocolo §7 (AGENTS.md). Para feature $ARGUMENTS con destino
$TO_ENV:

1. **CONTEXT** — verificar:
   - Worktree correcto (`cwd` = `<repo>--<feature-slug>/`) y rama
     actual (§6 Worktree).
   - Estado actual de la feature (`status.md`).
   - Ambiente destino válido: `pruebas`, `qa`, `main` u otro declarado
     en `branch-flow.md`.

2. **PRE-FLIGHT CHECK** — verificar las condiciones del gate de
   promoción (§6 Flujo de promoción):
   - PR a `pruebas`: tests verdes + spec aprobada + state ≥
     `partial-deploy-pruebas`.
   - PR a `qa`: tests verdes + QA sign-off (pendiente o adquirido) +
     state ≥ `partial-deploy-qa` o `feature-complete`.
   - PR a `main`: state `feature-complete` + `rollout-plan.md` con
     fases definidas + Ops sign-off (pendiente o adquirido).
   - Si falta algo, **parar** y reportar qué falta y a quién pedirlo.

3. **CLARIFY** — si la rama destino del PR es ambigua (varias ramas
   `qa-*`, por ejemplo), preguntar cuál. Si el feature flag de prod
   debe ir `OFF` al merge (lo normal), confirmar.

4. **PROPOSE** — mostrar al dev:
   - Branch source y target.
   - Resumen del PR: `R*.*` cubiertos, `AMD-NNN` aplicados, tasks done,
     commit count.
   - Reviewers sugeridos (equipo / QA / Ops según destino).
   - **Pedir OK explícito** antes de abrir el PR (§3.16 — acción
     visible a otros equipos).

5. **EXECUTE**:
   - `az repos pr create --source-branch <current> --target-branch
     <target> --title "..." --description "..."` (vía MCP de ADO o `az`
     CLI).
   - Linkear work items relevantes (`--work-items`).

6. **UPDATE STATUS** — cuando el dev confirme que el PR se mergeó:
   - Tasks afectadas → `deployed:<target-env>`.
   - Recalcular `state:` de la feature según §6 Lifecycle.

7. **CLOSE** — reportar:
   - URL del PR.
   - Qué gates faltan para la siguiente promoción.
   - **Siguiente paso sugerido** (ej. *"cuando QA firme, corre
     `/spec-promote <feature> --to qa`"*).
