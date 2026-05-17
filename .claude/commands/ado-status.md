---
description: Estado de un pipeline de Azure DevOps (sólo si tracker=azure-devops o runtime usa ADO Pipelines)
---

Ejecuta el flujo canónico de `/ado-status` definido en
`AGENTS.md` § *Slash commands disponibles* → *Definiciones canónicas*
→ `/ado-status`. Argumento: `$ARGUMENTS` = `<pipeline-id>`.

Aplica **sólo si** `repo-config.yaml > tracker: azure-devops` o el
CI/CD corre en ADO Pipelines. Si no aplica, proponer equivalente.
