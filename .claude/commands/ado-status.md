---
description: Estado de un pipeline de Azure DevOps (sólo si tracker=azure-devops o runtime usa ADO Pipelines)
---

**Aplicabilidad**: este comando aplica **sólo si**
`repo-config.yaml > tracker: azure-devops` **o** el CI/CD del repo
corre en ADO Pipelines (§6 *Configuración del repo* del methodology).
Si no aplica, proponer el equivalente (`/gh-status` para GitHub
Actions, `/gitlab-status` para GitLab CI, etc.) o reportar que el
estado del pipeline debe consultarse manualmente.

---

Para pipeline $PIPELINE_ID:

0. **Leer `repo-config.yaml`** y verificar que ADO Pipelines aplica.
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
