---
description: Vincular un PR a uno o más work items de Azure DevOps
---

Para PR $PR_ID con work items $WI_IDS (separados por coma):

1. Verificar que el PR existe y que el repo pertenece a un project de
   ADO.
2. Verificar que los work items existen; si están en otro project,
   usar relación **Related** (no Parent), §6 del methodology.
3. Linkear vía `az repos pr update --id $PR_ID --work-items $WI_IDS`.
4. Si el PR description no menciona `AB#<id>`, proponer agregarlo
   (mejora la auto-trazabilidad de ADO).
5. Reportar resultado y URLs.

Requiere MCP `azure-devops` configurado (ver AGENTS.md § Servidores MCP)
o `az` CLI autenticado.
