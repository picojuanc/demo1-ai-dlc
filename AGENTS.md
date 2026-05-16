# AGENTS.md — {{SERVICE_NAME}}

> Instrucciones canónicas para el Service Agent de este repo.
>
> **Estado de este repo**: starter template. Antes de empezar a generar
> código, completa los archivos de `stack/` (ver §Bootstrap). El Service
> Agent **no debe** generar código de producción mientras `stack/` esté
> incompleto: la spec necesita un stack definido para producir un
> `design.md` no-genérico.

---

## Project

**Service**: `{{SERVICE_NAME}}`
**Owner**: `{{TEAM_NAME}}` (lead: `{{LEAD_EMAIL}}`)
**Initiative**: `{{INITIATIVE_SLUG_OR_NONE}}`
**Stack**: ver `stack/tech-stack.md`
**Runtime**: ver `stack/tech-stack.md`
**Deploy target**: OpenShift namespace `{{OCP_NAMESPACE}}` en cluster `{{OCP_CLUSTER}}`
**On-call**: `{{ONCALL_EMAIL}}`

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

```
<type>({{SERVICE_NAME}}): T<n> - <desc> [R<x>.<y>] AB#<workitem-id>
```

Ejemplo:
```
feat({{SERVICE_NAME}}): T1 - <descripción corta> [R1.3, R5.1] AB#12347
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

| Comando | Cuándo |
|---|---|
| `/spec-new <slug>` | Bootstrap de una nueva feature con entrevista guiada |
| `/spec-implement <slug>` | Avanzar la siguiente task pending |
| `/spec-status <slug>` | Resumen legible del estado (read-only) |
| `/spec-verify <slug>` | Auditar cobertura R*.* ↔ tests, gaps, drift |
| `/spec-amend <slug>` | Cambio post-aprobación (cliente / legal / negocio) |
| `/spec-handoff <slug>` | Transferir ownership a otro dev |
| `/spec-promote <slug> --to <env>` | Abrir PR de promoción (pruebas → qa → main) |
| `/bug-triage <descripción>` | Clasificar bug A/B/C/D/E |
| `/ado-link <pr> <wi>` | Vincular PR a work item de ADO |
| `/ado-status <pipeline>` | Estado de un pipeline |

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

---

## Anti-patrones específicos

Ver `stack/constraints.md`. Cuando se complete ese archivo, copiar aquí
los anti-patrones más críticos como recordatorio explícito.

---

## Referencias

- Metodología: `<path-al-doc-AI-DLC>/ai-dlc-methodology.md` (fuente de
  verdad de §6 specs, §7 agentes, §11 slash commands).
- Stack: `stack/` (este repo).
- Branch flow: `branch-flow.md`.
- Specs activas: `specs/`.
- Catálogo / contratos compartidos: `.org/` (si aplica cross-repo).
