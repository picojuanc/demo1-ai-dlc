---
description: Vincular un PR a uno o más work items de Azure DevOps (sólo si tracker=azure-devops)
---

**Aplicabilidad**: este comando aplica **sólo si**
`repo-config.yaml > tracker: azure-devops` (§6 _Configuración del
repo_ del methodology). Si el tracker es otro (`github-issues`, `jira`,
`linear`) o `none`:

- `tracker: none` → no hay work items que linkear. Reportar y parar.
- otro tracker → proponer el comando equivalente (ej. `/gh-link`,
  `/jira-link`) o explicar que no existe todavía.

---

Para PR $PR_ID con work items $WI_IDS (separados por coma):

0. **Leer `repo-config.yaml`** y verificar `tracker: azure-devops`. Si
   no lo es, parar con el mensaje arriba.
1. Verificar que el PR existe y que el repo pertenece a un project de
   ADO (`tracker_config.org` / `tracker_config.project` en
   `repo-config.yaml`).
2. Verificar que los work items existen; si están en otro project,
   usar relación **Related** (no Parent), §6 del methodology.
3. Linkear vía `az repos pr update --id $PR_ID --work-items $WI_IDS`.
4. Si el PR description no menciona `AB#<id>`, proponer agregarlo
   (mejora la auto-trazabilidad de ADO).
5. Reportar resultado y URLs.

Requiere MCP `azure-devops` configurado (ver AGENTS.md § Servidores MCP)
o `az` CLI autenticado.
