---
description: Estado de un pipeline de Azure DevOps
---

Para pipeline $PIPELINE_ID:

1. `az pipelines runs list --pipeline-id $PIPELINE_ID --top 5`.
2. Reportar:
   - Última run: status (succeeded / failed / in-progress) y duración.
   - Stage donde falló (si aplica).
   - Link al log y al PR asociado.
3. Si el pipeline está vinculado a una feature por convención de
   commit `AB#<id>`, cruzar con `status.md` y decir si el deploy del
   último commit `done` ya está reflejado.

Requiere MCP `azure-devops` configurado (ver AGENTS.md § Servidores MCP)
o `az` CLI autenticado.
