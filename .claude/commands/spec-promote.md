---
description: Abrir PR de promoción al siguiente ambiente declarado en repo-config.yaml
---

Sigue el protocolo §7 (AGENTS.md). Para feature $ARGUMENTS con destino
$TO_ENV:

1. **CONTEXT** — verificar:
   - Worktree correcto (`cwd` = `<repo>--<feature-slug>/`) y rama
     actual (§6 Worktree).
   - Estado actual de la feature (`status.md`).
   - **Leer `repo-config.yaml`** (§6 _Configuración del repo_) y
     extraer: `repo_type`, `tracker`, `environments`, `promotion_path`.
     Si el archivo no existe, **parar** y proponer crearlo.
   - **Ambiente destino válido**: `$TO_ENV` debe estar presente en
     `environments[].name`. Si no, **parar** y listar los válidos.

2. **PRE-FLIGHT CHECK** — verificar el gate del ambiente destino. Las
   reglas exactas vienen de `environments[<destino>].gate` en
   `repo-config.yaml`. Patrón general:

   **`repo_type: service`** (default SYC: pruebas → qa → main):
   - PR a `pruebas`: tests verdes + spec aprobada + state ≥
     `partial-deploy-pruebas`.
   - PR a `qa`: tests verdes + QA sign-off + state ≥
     `partial-deploy-qa` o `feature-complete`.
   - PR a `main`: state `feature-complete` + `rollout-plan.md` +
     Ops sign-off.

   **`repo_type: library`** (paquete npm/pip/maven, p.ej. pruebas →
   main):
   - PR a `pruebas` (`deploy_trigger: publish-prerelease`): tests
     verdes + version bump prerelease + changelog. NO hay
     "ambiente" — el publish al registry **es** el deploy.
   - PR a `main` (`deploy_trigger: publish-release`): state
     `feature-complete`, QA del consumidor firmó sobre el prerelease,
     release notes y tag firmado.

   **`repo_type: infra`** (sandbox → prod):
   - PR a `sandbox`: `terraform plan` dry-run + revisión.
   - PR a `prod`: state `feature-complete`, `terraform plan` revisado,
     Ops sign-off y ventana de cambio si aplica.

   **`repo_type: frontend-app`**: igual a `service` salvo que también
   considera previews por PR si están declarados.

   Si falta algo, **parar** y reportar qué falta y a quién pedirlo.

3. **CLARIFY** — si la rama destino del PR es ambigua (varias ramas
   `qa-*`, por ejemplo), preguntar cuál. Si el feature flag de prod
   debe ir `OFF` al merge (lo normal), confirmar.

4. **PROPOSE** — mostrar al dev:
   - Branch source y target.
   - Resumen del PR: `R*.*` cubiertos, `AMD-NNN` aplicados, tasks done,
     commit count.
   - Reviewers sugeridos (equipo / QA / Ops según destino).
   - Si `repo_type: library`: tipo de publish (prerelease/release) y
     version bump propuesto.
   - **Pedir OK explícito** antes de abrir el PR (§3.16 — acción
     visible a otros equipos).

5. **EXECUTE** — comando según `tracker` declarado en
   `repo-config.yaml`:
   - `tracker: azure-devops` → `az repos pr create --source-branch
<current> --target-branch <target> ...` (vía MCP de ADO o `az`
     CLI). Linkear work items (`--work-items`).
   - `tracker: github-issues` → `gh pr create --base <target> --head
<current> ...`. Linkear issues si aplica (`closes #<n>`).
   - `tracker: jira` / `linear` / etc. → análogo.
   - `tracker: none` → `gh pr create` (o equivalente del remote),
     **sin** work items.

   Para `repo_type: library`: en lugar de PR a `main` para "release",
   el comando puede ser un workflow de publish (`npm publish`,
   `pnpm publish`, etc.) ejecutado por el pipeline. Confirmar el modo
   con el dev antes de actuar.

6. **UPDATE STATUS** — cuando el dev confirme que el PR se mergeó (o
   el publish completó para library):
   - Tasks afectadas → `deployed:<target-env>` (o `published:<target>`
     para library).
   - Recalcular `state:` de la feature según §6 Lifecycle.

7. **CLOSE** — reportar:
   - URL del PR (o del release).
   - Qué gates faltan para la siguiente promoción según
     `promotion_path` declarado.
   - **Siguiente paso sugerido** (ej. _"cuando QA firme, corre
     `/spec-promote <feature> --to qa`"_ — usar el siguiente nombre de
     `promotion_path`, no asumir `qa`).
