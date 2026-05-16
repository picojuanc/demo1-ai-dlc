---
description: Avanzar la siguiente task con pre-flight check
---

Sigue el protocolo §7 (AGENTS.md). Para feature $ARGUMENTS:

1. **CONTEXT** — leer `status.md`, `tasks.md`, `requirements.md`,
   `design.md`, y `dependencies`/`amendments` si existen.

2. **PRE-FLIGHT CHECK** — reportar al dev:
   - **`stack/` completo**: si algún archivo aún tiene `TODO`, **parar**
     y proponer completar `stack/` primero (AGENTS.md § Bootstrap).
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

4. **PROPOSE** — explicar:
   - Archivos a crear/modificar (respetando `stack/architecture.md` §
     Estructura de carpetas y `stack/patterns.md` § Naming).
   - Tests a escribir (con `// Derived from R*.*` según
     `stack/testing.md`).
   - Nivel de riesgo / complejidad estimado.
   - Pedir OK explícito si la task es M/L o toca código compartido.

5. **EXECUTE**:
   - Tests primero con `// Derived from R*.*`.
   - Código que pase tests (respetando `stack/constraints.md`).
   - Linter, typecheck.
   - Iterar hasta verde.

6. **UPDATE STATUS** — `status.md`: task → `done` o `deployed:<env>`
   según corresponda, con commit hash y fecha (§6 Lifecycle).
   Actualizar el campo `state` si cambia.

7. **CLOSE** — reportar:
   - Qué se hizo (task ID, R*.* cubiertos, commit hash).
   - Qué quedó pendiente (siguientes tasks, `D-N` involucradas).
   - **Siguiente paso sugerido**: abrir PR ahora, continuar con la
     siguiente task, esperar review humano, desplegar a dev, etc.
   - Si la siguiente task podría avanzarse, **preguntar** antes de
     continuar — NO auto-avanzar (§3.16).
