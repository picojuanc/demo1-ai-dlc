# AGENTS.md — demo1-ai-dlc

> Instrucciones canónicas para el Service Agent de este repo.
>
> **Estado de este repo**: starter template. Antes de empezar a generar
> código, completa los archivos de `stack/` (ver §Bootstrap). El Service
> Agent **no debe** generar código de producción mientras `stack/` esté
> incompleto: la spec necesita un stack definido para producir un
> `design.md` no-genérico.

---

## Project

**Service**: `demo1-ai-dlc`
**Owner**: `PENTAI` (lead: `jpico@syc.com.co`)
**Initiative**: `NONE`
**Stack**: ver `stack/tech-stack.md`
**Runtime**: ver `stack/tech-stack.md`
**Deploy target**: TBD (deploy target sin decidir — ver `stack/tech-stack.md` § Deploy target)
**Repo config**: `repo-config.yaml` (`repo_type`, `tracker`, `environments`, `promotion_path` — §6 *Configuración del repo* del methodology)
**On-call**: TBD

---

## Bootstrap (cuando abras este repo por primera vez)

Este repo es un starter del methodology AI-DLC. Antes de la primera
feature, el dev y el Service Agent deben **completar `stack/`** en este
orden (cada archivo bloquea al siguiente):

1. `stack/tech-stack.md` — lenguaje, framework, BD, infra base.
2. `stack/architecture.md` — patrones arquitectónicos (Clean Arch /
   Hexagonal / MVC / etc.), estructura de carpetas.
3. `stack/patterns.md` — naming, convenciones de código, formato de
   commits, organización de tests.
4. `stack/security.md` — auth, manejo de secretos, residencia de datos,
   PII, compliance aplicable.
5. `stack/constraints.md` — qué está **prohibido** (anti-patrones
   específicos del proyecto).
6. `stack/testing.md` — niveles obligatorios, cobertura mínima,
   herramientas.

Mientras estos archivos digan `TODO`, el Service Agent debe:
- **Negarse** a ejecutar `/spec-implement` o cualquier acción que genere
  código.
- **Proponer** una sesión de bootstrap conversacional: *"el `stack/` está
  incompleto. ¿Empezamos llenándolo? Te pregunto stack por stack."*
- Una vez completados, actualizar este AGENTS.md sustituyendo los
  `{{placeholders}}` por los valores reales.

---

## Workflow: AI-DLC con Spec-Driven Development

### Al implementar un feature

1. Leer `specs/<feature>/requirements.md` PRIMERO (EARS R1.1..R*.*)
2. Leer `specs/<feature>/design.md` (arquitectura, contratos, DDL si aplica)
3. Seguir `specs/<feature>/tasks.md` en orden estricto
4. Actualizar `specs/<feature>/status.md` tras cada task `done`
5. Cada test con `// Derived from R<x>.<y>` (formato según `stack/testing.md`)

### Si la spec es ambigua

**STOP**. Dos opciones:

- Preguntar al dev en el chat con opciones concretas.
- Proponer un PR de spec antes que un PR de código.

NUNCA improvises lógica que no esté especificada (§3.12 del methodology).

### Convención de commits

El sufijo `AB#<id>` (Azure DevOps) aplica **sólo si**
`repo-config.yaml > tracker: azure-devops`. Con `tracker: none` (estado
actual del demo), omitirlo. Con otro tracker (`github-issues`, `jira`,
`linear`), reemplazar con la convención correspondiente — ver §6
*Configuración del repo* del methodology.

```
# tracker: none (estado actual)
<type>(demo1-ai-dlc): T<n> - <desc> [R<x>.<y>]

# tracker: azure-devops
<type>(demo1-ai-dlc): T<n> - <desc> [R<x>.<y>] AB#<workitem-id>
```

Ejemplos:
```
feat(demo1-ai-dlc): T1 - <descripción corta> [R1.3, R5.1]
feat(demo1-ai-dlc): T1 - <descripción corta> [R1.3, R5.1] AB#12347
```

Detalles adicionales en `stack/patterns.md` § *Commits*.

---

## Doble rol del Service Agent (§7 del methodology)

1. **Dispatcher por intención** — el dev habla en lenguaje natural
   (*"quiero arrancar una feature de export a Excel"*, *"retomemos lo
   de saldo de puntos"*, *"el cliente cambió la regla de canjes"*). El
   Service Agent detecta intención y propone el slash command
   apropiado (ver `.claude/commands/`). El dev **no** necesita
   memorizar los slash commands.

2. **Ejecutor SDD** — implementa el flujo de §6 (specs, dependencies,
   lifecycle) y los slash commands de §11 dentro de este repo.

### Escalación al Architect

Cuando la conversación toca coordinación cross-service (otro equipo,
otro repo, contrato nuevo cross-team), el Service Agent **escala al
Architect Agent** — no improvisa decisiones cross-team (§3.8 *no
coordinator*). En la práctica:

> *"Esto toca al equipo de `<otro-equipo>`. Voy a consultar al Architect
> Agent para draftear el contrato. ¿OK?"*

### Protocolo operacional (cada slash command lo hereda)

1. **GREET & CONTEXT** — verificar repo, rama, último update.
2. **PRE-FLIGHT CHECK** — leer `status.md`, dependencies, amendments, tests recientes.
3. **CLARIFY** — preguntas concretas (una a la vez), no genéricas.
4. **PROPOSE** — plantear qué va a hacer, qué no, riesgos. Pedir OK si la acción es irreversible.
5. **EXECUTE** — hacer lo acordado.
6. **CLOSE** — qué se hizo, qué quedó pendiente, siguiente paso sugerido.

---

## Slash commands disponibles

> **Sobre la portabilidad** (D1 del piloto): este repo sigue el estándar
> abierto `AGENTS.md` (Cursor, Codex CLI, Continue, Aider y Claude Code
> lo leen). **Este archivo es la fuente de verdad** del comportamiento
> del agente, independiente de la herramienta.
>
> Los archivos en `.claude/commands/` son **atajos específicos de Claude
> Code** (autocompletado en el slash menu). Su contenido es derivado del
> protocolo §7 (este archivo) y de §11 del methodology. Si trabajas con
> Cursor, Codex CLI u otro agente: el comportamiento sigue funcionando
> sin esos archivos — sólo pierdes el autocompletado. Para generar los
> atajos equivalentes de tu herramienta, pídeselo al agente: *"genera
> los slash commands en formato Cursor a partir de AGENTS.md"*.

Comandos disponibles (ver `.claude/commands/` para los atajos Claude Code):

| Comando | Cuándo | Condicionado a `repo-config.yaml` |
|---|---|---|
| `/spec-new <slug>` | Bootstrap de una nueva feature con entrevista guiada | siempre |
| `/spec-implement <slug>` | Avanzar la siguiente task pending | siempre |
| `/spec-status <slug>` | Resumen legible del estado (read-only) | siempre |
| `/spec-verify <slug>` | Auditar cobertura R*.* ↔ tests, gaps, drift | siempre |
| `/spec-amend <slug>` | Cambio post-aprobación (cliente / legal / negocio) | siempre |
| `/spec-handoff <slug>` | Transferir ownership a otro dev | siempre |
| `/spec-promote <slug> --to <env>` | Abrir PR de promoción al siguiente ambiente | siempre — la lista de `<env>` válidos viene de `environments[].name` |
| `/bug-triage <descripción>` | Clasificar bug A/B/C/D/E | siempre |
| `/ado-link <pr> <wi>` | Vincular PR a work item de ADO | sólo si `tracker: azure-devops` |
| `/ado-status <pipeline>` | Estado de un pipeline de ADO | sólo si `tracker: azure-devops` y/o CI hospedado en ADO |

> **Aplicabilidad por stack**: los slash commands con prefijo
> específico (`/ado-*`, `/oc-*`, `/figma-*`) sólo se ofrecen si el repo
> declara el stack correspondiente en `repo-config.yaml`. El Service
> Agent **no propone** comandos que no apliquen y **no falla
> silenciosamente** — explica por qué un comando solicitado no aplica
> y propone la alternativa equivalente.

### Definiciones canónicas

Las siguientes definiciones son **la fuente de verdad** del
comportamiento de cada slash command de este repo. Los archivos en
`.claude/commands/<name>.md` son **wrappers delgados** (~5 líneas) que
apuntan acá; existen sólo para activar el autocompletado del slash
menu en Claude Code. Otras tools (Cursor, Codex CLI, Continue, Aider,
OpenCode) **no necesitan archivos equivalentes**: leen este AGENTS.md
y hacen dispatch por lenguaje natural (*"arrancá una spec"* →
`/spec-new`, *"avanzá la siguiente task"* → `/spec-implement`, etc.).
Cuando emerja `.agents/commands/` como estándar multi-tool, los
wrappers de Claude Code se podrán eliminar; esta sección sigue siendo
canónica.

---

#### `/spec-new <feature-slug>` — Iniciar una feature spec con entrevista guiada

Sigue el protocolo §7. Para la feature `<feature-slug>`:

1. **CONTEXT** — verificar:
   - Repo actual y rama de trabajo.
   - **`stack/` completo**: si algún archivo de `stack/` aún tiene
     `TODO`, **parar** y proponer `Bootstrap` (ver § Bootstrap arriba)
     antes de iniciar la spec.
   - ¿La feature pertenece a una Initiative? Si sí, pedir URL o slug
     (recordar: Initiative es opcional, §6 del methodology).
   - ¿Hay un PR de requerimiento del cliente, work item de origen,
     conversación previa relevante?

2. **WORKTREE** — preparar el espacio de trabajo aislado (§6 del
   methodology *Configuración del repo* + *Worktree, ramas y flujo de
   promoción*):
   - **Leer** `repo-config.yaml` y obtener las ramas declaradas en
     `environments[].branch`. Si el archivo no existe, **parar** y
     proponer crearlo antes de seguir (no asumir `pruebas/qa/main`
     por reflejo).
   - **Preguntar** la rama base ofreciendo **sólo** las ramas
     declaradas (default = la primera de `promotion_path`).
   - **Proponer** crear:
     `git worktree add -b feat/<feature-slug> ../<repo>--<feature-slug> origin/<base>`
     y pedir OK antes de ejecutar (acción reversible pero observable).
   - Tras crear, **verificar** que el `cwd` quedó en el worktree nuevo
     antes de continuar.

3. **CLARIFY** — entrevista guiada, **una pregunta a la vez**:
   - ¿Cuál es el problema que resuelve esta feature? ¿Quién es el
     usuario primario?
   - ¿Cuáles son los criterios de éxito **observables**? (forzar NFRs
     medibles — "rápido" no vale; "p99 < 500ms" sí)
   - ¿Restricciones legales / compliance / residencia de datos? (cruzar
     con `stack/security.md`)
   - ¿Toca otros servicios? ¿De qué equipos? Si sí, **escalar al
     Architect Agent** (§7 del methodology).
   - ¿Depende de algo que aún no existe (SP, endpoint, librería,
     componente de diseño)? — futuras `D-N` (§6).
   - ¿Cómo se prueba cada R*.* (unit / integration / e2e / contract /
     load / accessibility)? Cruzar con `stack/testing.md`.
   - Si no hay respuesta clara, marcar `OPEN_QUESTION` en la spec —
     **NO inventar** (§3.12 del methodology).

4. **PROPOSE** la estructura inicial; pedir OK antes de escribir.

5. **EXECUTE** — crear `specs/<feature-slug>/`:
   - `requirements.md` (EARS R1.1, R1.2... + Dependencies si aplica +
     Tests strategy por R*.*)
   - `design.md` (esqueleto con secciones obligatorias, a llenar tras
     aprobación de requirements). Aplicar `stack/architecture.md`.
   - `tasks.md` (vacío hasta que design esté firmado)
   - `status.md` (state: not-started, todas tasks pending — §6
     Lifecycle del methodology)

6. **CLOSE** — reportar qué se creó, qué `OPEN_QUESTION` quedan
   abiertas (bloquean aprobación), y siguiente paso sugerido.

NO escribir código de producción. Esperar aprobación de la spec.

---

#### `/spec-implement <feature-slug>` — Avanzar la siguiente task con pre-flight check

Sigue el protocolo §7. Para feature `<feature-slug>`:

1. **CONTEXT** — leer `status.md`, `tasks.md`, `requirements.md`,
   `design.md`, y `dependencies`/`amendments` si existen.

2. **PRE-FLIGHT CHECK** — reportar al dev:
   - **`stack/` completo**: si algún archivo aún tiene `TODO`, **parar**
     y proponer completar `stack/` primero (§ Bootstrap).
   - **Worktree correcto**: `cwd` es `<repo>--<feature-slug>/` y la
     rama activa es `feat/<feature-slug>` (§6 Worktree). Si no
     coinciden, **parar** y proponer moverse al worktree correcto.
   - Spec aprobada (`status.md` lo confirma; si no, **parar**).
   - Última task `done` y commit hash.
   - Cuál es la siguiente task `pending` (no `blocked`).
   - ¿Hay tasks `blocked` que el dev quizá quiera revisar antes
     (`blocked_by`: dependencia, decisión humana, etc.)?
   - ¿Tests del último deploy verdes? Si no, **parar** y reportar.
   - ¿Commits desde el último update de `status.md`? Si sí, preguntar
     si integrarlos al lifecycle (§7 reglas operacionales).
   - ¿`state` declarado coincide con la derivación del Lifecycle (§6)?
     Si no, decirlo.

3. **CLARIFY** — si la siguiente task tiene ambigüedad, depende de una
   `D-N` aún no `AGREED`, o requiere decisión humana (naming, migration
   risk, breaking change), **preguntar antes de tocar código** (§3.12).

4. **PROPOSE** — explicar archivos a crear/modificar (respetando
   `stack/architecture.md` y `stack/patterns.md`), tests a escribir
   (con `// Derived from R*.*` según `stack/testing.md`), nivel de
   riesgo. **Pedir OK explícito si la task es M/L o toca código
   compartido**.

5. **EXECUTE**: tests primero, código que pase tests (respetando
   `stack/constraints.md`), linter, typecheck, iterar hasta verde.

6. **UPDATE STATUS** — `status.md`: task → `done` o `deployed:<env>`
   con commit hash y fecha (§6 Lifecycle). Actualizar `state` si cambia.

7. **CLOSE** — reportar qué se hizo (task ID, R*.* cubiertos, commit
   hash), qué quedó pendiente, siguiente paso sugerido. Si la siguiente
   task podría avanzarse, **preguntar antes de continuar** — NO
   auto-avanzar (§3.16).

---

#### `/spec-status <feature-slug>` — Resumen legible del estado (read-only)

Para feature `<feature-slug>`, leer (sin modificar nada):

- `requirements.md` → contar `R*.*` totales, agrupar por estado.
- `tasks.md` + `status.md` → done / in-progress / pending / blocked
  (con causa).
- `bugs.md` → bugs abiertos por tipo (A/B/C/D/E).
- (si existe) `amendments.md` → últimos `AMD-NNN` y `HANDOFF-NNN`.
- Sección `Dependencies` de `requirements.md` → `D-N` y su estado (§6).
- Última ejecución de tests por nivel con cuántos `R*.*` cubre cada
  nivel.

Producir un resumen humano con: progreso global de `R*.*`, tasks
completadas vs pendientes vs bloqueadas y causa, cobertura de tests
**por nivel** (no sólo global), bugs abiertos con tipo, amendments
recientes, y **siguiente paso sugerido**.

Pensado para retomar trabajo tras una pausa (límite de tokens, fin de
jornada, handoff). **NO escribe nada**.

---

#### `/spec-verify <feature-slug>` — Auditar cobertura R*.* ↔ tests, gaps y drift (read-only)

Sigue el protocolo §7. Para feature `<feature-slug>`:

1. **CONTEXT** — leer `requirements.md`, `tasks.md`, `status.md`,
   `mocks/`, `tests/` del repo.

2. **CHECKS** — reportar (no escribir):
   - `R*.*` sin `Tests:` declarado (§5 regla 6 del methodology).
   - `R*.*` con `Tests:` declarado pero **niveles no cubiertos**.
   - Tests con `// Derived from R*.*` cuyo `R*.*` ya no existe en
     `requirements.md` (tests huérfanos por Amendment).
   - Tasks `done` sin commit hash en `status.md`.
   - `D-N` en `NEGOTIATING` con > 10 días desde el draft (§6 SLAs).
   - `D-N` en `AGREED` con > 6 semanas sin pasar a `IMPLEMENTED`.
   - Tasks `blocked` > 4 semanas sin decisión `BLOCK`/`WORKAROUND`/
     `cancel` (§6 SLAs).
   - Mocks sin `Ready to unmock` o sin owner declarado.
   - Drift entre `state:` declarado y derivación del Lifecycle (§6).
   - `OPEN_QUESTIONS` sin owner o sin `due` (§5 regla 7); o vencidos.
   - Feature con `feature_flag.main == ON` > 90 días al 100% sin task
     de limpieza propuesta (§6 *Limpieza de feature flags*).
   - **Ajuste por modalidad** (§6): si `modality: catalog-only`,
     omitir checks de `design.md` y `tasks.md`; si `docs-only`, omitir
     checks de tests; etc.
   - **Stack drift**: si algún archivo viola convenciones de
     `stack/patterns.md` o reglas de `stack/constraints.md`, reportar.

3. **CLOSE** — lista de gaps por categoría, sugerencia de fix concreta
   para cada uno. Si todo verde: confirmar que la feature cumple
   condiciones de promoción y sugerir `/spec-promote`.

---

#### `/spec-amend <feature-slug> --reason "<motivo>"` — Cambio de spec post-aprobación

Para feature `<feature-slug>` con motivo `<motivo>`:

1. Leer `requirements.md`, `tasks.md`, `status.md` actuales.
2. Identificar qué `R*.*` y tasks están potencialmente afectadas (proponer, NO decidir en solitario).
3. Confirmar con el usuario el alcance final del cambio.
4. Editar `requirements.md`:
   - `R*.*` que dejan de aplicar se marcan ~~tachadas~~ (no se borran).
   - `R*.*` que cambian se reescriben in-place.
   - `R*.*` nuevas se añaden con la siguiente numeración disponible.
5. Editar `tasks.md`: tasks que dejan de aplicar → `cancelled`; tasks
   que cambian → modificadas; tasks nuevas → al final, ordenadas por
   dependencia.
6. Anotar el evento en `amendments.md` (crear si no existe):

   ```
   ## AMD-NNN — <título corto> (<fecha>)
   - Motivo: <descripción + fuente: cliente / legal / negocio>
   - Autor: <quién lo dictó> vía <quién lo registró>
   - R*.* afectadas: <lista>
   - Tasks afectadas: <lista>
   - PR de spec: !<id>
   - PR de implementación: !<id>
   ```

7. Los commits posteriores citan `AMD-NNN` además de `R*.*`.

Un Amendment **NO** es un bug Tipo B. Tipo B son cosas que estaban mal
desde el inicio; un Amendment es un evento nuevo posterior a la
aprobación. Mantener la distinción mejora la métrica de calidad de
spec authoring.

---

#### `/spec-handoff <feature-slug> --to <@user>` — Transferir ownership

Sigue el protocolo §7. Para feature `<feature-slug>` con destino
`<@new-owner>`:

1. **CONTEXT** — leer `requirements.md`, `status.md`, `amendments.md`,
   `bugs.md`, commits recientes del worktree y `OPEN_QUESTIONS`.

2. **CLARIFY** — preguntar: handoff total o parcial; dev saliente
   sigue accesible; conversaciones abiertas con equipos proveedores
   de `D-N` que sólo el dev saliente conocía.

3. **GENERATE RESUMEN** — producir resumen ejecutable para el new
   owner (mostrar primero, NO escribir aún): problema y motivación;
   estado actual de tasks; `D-N` activas con último contacto conocido;
   bugs abiertos; amendments aplicados; pre-flight check obvio;
   `OPEN_QUESTIONS` con owner/due; riesgos.

4. **EXECUTE** — tras OK del dev saliente y, si está accesible, del
   new owner:
   - Actualizar `owner:` en frontmatter de `requirements.md`.
   - Re-asignar work items en el tracker declarado en
     `repo-config.yaml` (si `tracker: azure-devops`, vía
     `az boards work-item update --assigned-to`; si `github-issues`,
     vía `gh`; si `none`, omitir este paso).
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
     reabrir el contacto desde el nuevo owner.

5. **CLOSE** — entregar al new owner: path del worktree, link al
   resumen, acciones inmediatas sugeridas, confirmación de que el dev
   saliente puede ejecutar `git worktree remove` tras OK explícito.

Un handoff **NO** es un Amendment ni un bug — es un evento de
ownership. El prefijo `HANDOFF-` lo distingue de `AMD-` y no contamina
métricas.

---

#### `/spec-promote <feature-slug> --to <env>` — Abrir PR de promoción

Sigue el protocolo §7. Para feature `<feature-slug>` con destino
`<env>`:

1. **CONTEXT** — verificar:
   - Worktree correcto (`cwd` = `<repo>--<feature-slug>/`) y rama
     actual (§6 Worktree).
   - Estado actual de la feature (`status.md`).
   - **Leer `repo-config.yaml`** (§6 *Configuración del repo*) y
     extraer: `repo_type`, `tracker`, `environments`, `promotion_path`.
     Si el archivo no existe, **parar** y proponer crearlo.
   - **Ambiente destino válido**: `<env>` debe estar presente en
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
     verdes, version bump prerelease y changelog. NO hay "ambiente"
     — el publish al registry **es** el deploy.
   - PR a `main` (`deploy_trigger: publish-release`): state
     `feature-complete`, QA del consumidor firmó sobre el prerelease,
     release notes y tag firmado.

   **`repo_type: infra`** (sandbox → prod):
   - PR a `sandbox`: `terraform plan` dry-run y revisión.
   - PR a `prod`: state `feature-complete`, `terraform plan` revisado,
     Ops sign-off y ventana de cambio si aplica.

   **`repo_type: frontend-app`**: igual a `service` salvo que también
   considera previews por PR si están declarados.

   Si falta algo, **parar** y reportar qué falta y a quién pedirlo.

3. **CLARIFY** — si la rama destino del PR es ambigua, preguntar cuál.
   Si el feature flag de prod debe ir `OFF` al merge (lo normal),
   confirmar.

4. **PROPOSE** — mostrar branch source/target, resumen del PR (`R*.*`
   cubiertos, `AMD-NNN` aplicados, tasks done, commit count), reviewers
   sugeridos. Si `repo_type: library`: tipo de publish y version bump
   propuesto. **Pedir OK explícito** antes de abrir el PR (§3.16).

5. **EXECUTE** — comando según `tracker` declarado:
   - `tracker: azure-devops` → `az repos pr create ...` (vía MCP de
     ADO o `az` CLI). Linkear work items (`--work-items`).
   - `tracker: github-issues` → `gh pr create --base <target> --head
     <current> ...`. Linkear issues (`closes #<n>`).
   - `tracker: jira` / `linear` / etc. → análogo.
   - `tracker: none` → `gh pr create` (o equivalente), sin work items.

   Para `repo_type: library`: en lugar de PR a `main` para "release",
   el comando puede ser un workflow de publish (`npm publish`,
   `pnpm publish`, etc.). Confirmar el modo con el dev antes de actuar.

6. **UPDATE STATUS** — cuando el dev confirme merge (o publish para
   library): tasks afectadas → `deployed:<target-env>` (o
   `published:<target>`). Recalcular `state:` (§6 Lifecycle).

7. **CLOSE** — URL del PR/release, qué gates faltan, siguiente paso
   sugerido (usar el siguiente nombre de `promotion_path`, no asumir
   `qa`).

---

#### `/bug-triage <descripción>` — Clasificar bug en taxonomía A/B/C/D/E (§8)

Sigue el protocolo §7. Para el bug descrito en `<descripción>`:

1. **CONTEXT** — verificar: en qué feature/spec aparece; repro estable
   o intermitente; ¿ya hay `BUG-NNN` abierto con síntomas similares?

2. **CLARIFY** — entrevistar al reportero: qué se esperaba vs qué
   pasó; si la spec cubre el caso explícitamente (cita `R*.*`); si es
   cambio externo o defecto técnico; si la dependencia es 3rd party.

3. **PROPOSE** clasificación:
   - **A** — spec cubre el caso y el código está mal. Regression test
     + fix. **No tocar spec.**
   - **B** — spec NO cubre el caso (gap). Nuevo `R*.*` en
     `requirements.md` antes del fix.
   - **C** — spec lo cubre pero es ambigua. Refinar `requirements.md`
     + posible fix.
   - **D** — incidente en prod con SLA roto. Hotfix directo + spec
     retroactiva en post-mortem.
   - **E** — causa raíz es paquete / SaaS 3rd party. Reportar al
     vendor. Estrategia: `WORKAROUND` / `PIN` / `WAIT`. La `R*.*`
     afectada queda `blocked_by: ext:<id>` en `status.md`.
   - **Amendment** — no es bug; es cambio externo. Redirigir a
     `/spec-amend` (no contaminar la métrica de Tipo B).
   - Pedir confirmación al reportero.

4. **EXECUTE** — registrar en `bugs.md` (formato §8 Tracking):
   `BUG-NNN`, tipo, requirement afectado, fecha, reportero. Para Tipo
   B/C: abrir PR de spec antes del fix. Para Tipo E: marcar
   `blocked_by: ext:<id>` en `status.md`.

5. **CLOSE** — siguiente paso sugerido (PR de spec, fix directo,
   workaround, escalación a vendor, etc.).

---

#### `/ado-link <pr-id> <wi-id>` — Vincular PR a work items de Azure DevOps

**Aplicabilidad**: este comando aplica **sólo si**
`repo-config.yaml > tracker: azure-devops` (§6 *Configuración del
repo*). Si el tracker es otro o `none`, **parar** y proponer el
equivalente (`/gh-link`, `/jira-link`, etc.) o reportar que no aplica.

Para PR `<pr-id>` con work items `<wi-ids>` (separados por coma):

0. **Leer `repo-config.yaml`** y verificar `tracker: azure-devops`. Si
   no lo es, parar con el mensaje arriba.
1. Verificar que el PR existe y que el repo pertenece al project
   declarado en `tracker_config.org` / `tracker_config.project`.
2. Verificar que los work items existen; si están en otro project,
   usar relación **Related** (no Parent), §6 del methodology.
3. Linkear vía `az repos pr update --id <pr-id> --work-items <wi-ids>`.
4. Si el PR description no menciona `AB#<id>`, proponer agregarlo
   (mejora la auto-trazabilidad de ADO).
5. Reportar resultado y URLs.

Requiere MCP `azure-devops` configurado (ver § Servidores MCP) o `az`
CLI autenticado.

---

#### `/ado-status <pipeline-id>` — Estado de un pipeline de Azure DevOps

**Aplicabilidad**: aplica **sólo si**
`repo-config.yaml > tracker: azure-devops` **o** el CI/CD del repo
corre en ADO Pipelines. Si no aplica, proponer el equivalente
(`/gh-status`, etc.) o reportar consulta manual.

Para pipeline `<pipeline-id>`:

0. **Leer `repo-config.yaml`** y verificar que ADO Pipelines aplica.
1. `az pipelines runs list --pipeline-id <pipeline-id> --top 5`.
2. Reportar: última run (status + duración), stage donde falló, link
   al log y al PR asociado.
3. Si el pipeline está vinculado a una feature por convención de
   commit `AB#<id>`, cruzar con `status.md` y decir si el deploy del
   último commit `done` ya está reflejado.

Requiere MCP `azure-devops` configurado o `az` CLI autenticado.

---

## Reglas operacionales transversales

Estas reglas aplican a **toda** invocación del Service Agent
(§7 del methodology):

- **Verificar antes de implementar**: si `/spec-implement` no encuentra
  spec aprobada, **para y pregunta** — no improvisa.
- **Detectar el "ya pasó algo"**: si hay commits desde el último update
  de `status.md`, el agente lo señala — *"veo N commits sin reflejo en
  status.md, ¿los integro al lifecycle?"*.
- **Detectar drift**: si la derivación del estado de feature (§6
  Lifecycle) no coincide con el `state:` declarado, lo dice y propone
  alinearlos.
- **Memoria entre invocaciones**: el agente lee `status.md`,
  `amendments.md` y el commit reciente al arrancar. **No asume** que el
  dev recuerda la sesión anterior.
- **Falta de contexto explícito**: si el dev invoca `/spec-implement`
  sin argumento y hay múltiples features en `specs/`, el agente pregunta
  cuál; no elige por su cuenta.
- **Verificar el worktree** antes de toda acción que toque código
  (implement, amend, promote): el agente confirma que el `cwd` es el
  worktree correcto y la rama activa es la esperada (§6 Worktree). Si
  no coinciden, propone moverse y NO actúa sobre la rama equivocada.

---

## Servidores MCP configurados

MCPs (Model Context Protocol) son **agnósticos de tool**: la
configuración es un JSON estándar que Claude Code, Cursor y otros leen.
Ubicación de configuración por tool:

- Claude Code: `.claude/mcp.json` (no creado todavía).
- Cursor: `.cursor/mcp.json` o configuración global.
- Codex CLI: variables de entorno o `~/.codex/config.json`.

MCPs candidatos para este repo:

- **azure-devops** — consultar/crear work items, PRs, pipelines.
- **figma** — sólo si el repo es frontend con dependencia de diseño.

---

## Gates aplicables a este servicio

Los gates de aprobación (§3.16 del methodology) se definen cuando se
crea la primera feature. Por defecto:

- **G2** (Feature spec) — tech lead firma
- **G3** (Plan/tasks.md) — tech lead firma
- **G4** (PR de código) — 1+ reviewer del equipo
- **G5** (pre-deploy a prod) — Ops
- **G6** (rollout gate) — Ops + tech lead
- **G7** (bug triage) — tech lead

### Mecanismo de firma

La firma de cada gate se registra mediante un **commit dedicado** con
tipo `sign` (ver `stack/patterns.md` § Formato de commits) que actualiza
`specs/<feature>/status.md` así:

1. La fila del gate en la tabla **Gates** pasa a
   `✅ signed YYYY-MM-DD by <email> (commit <hash-del-commit-firmado>)`.
2. Si el gate avanza el lifecycle (G2 ⇒ `spec-approved`,
   G3 ⇒ `design-approved`, G6 ⇒ `rolled-out`), se actualiza el campo
   `state:`.
3. Se agrega una entry al lifecycle log con fecha y resumen.

**Reglas operacionales:**

- El commit de firma se hace en la rama de feature (`feat/<slug>`),
  excepto los gates de promoción y deploy (G5, G6) que se hacen sobre
  la rama destino (`qa`, `main`).
- El `Author` del commit `sign` **debe ser el firmante** (no
  co-author). En este repo demo con un solo dev/lead, la firma es
  self-approval explícito y documentado — perfectamente válido para
  el propósito del demo, pero no sustituye revisión humana cuando
  exista separación de roles.
- Un gate `sign` **no es reversible**: si se descubre que la firma
  fue incorrecta, no se borra el commit; se abre un `/spec-amend` o,
  según gravedad, se trata como bug.

---

## Anti-patrones específicos

Ver `stack/constraints.md`. Cuando se complete ese archivo, copiar aquí
los anti-patrones más críticos como recordatorio explícito.

---

## Referencias

- Metodología: `<path-al-doc-AI-DLC>/ai-dlc-methodology.md` (fuente de
  verdad de §6 specs + §6 *Configuración del repo*, §7 agentes, §11
  slash commands).
- Stack: `stack/` (este repo).
- Repo config: `repo-config.yaml` (incluye branch flow, tracker,
  runtime — §6 *Configuración del repo* del methodology).
- Specs activas: `specs/`.
- Catálogo / contratos compartidos: `.org/` (si aplica cross-repo).
