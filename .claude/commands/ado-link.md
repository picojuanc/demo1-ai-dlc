---
description: Vincular un PR a uno o más work items de Azure DevOps (sólo si tracker=azure-devops)
---

Ejecuta el flujo canónico de `/ado-link` definido en
`AGENTS.md` § *Slash commands disponibles* → *Definiciones canónicas*
→ `/ado-link`. Argumentos: `$ARGUMENTS` = `<pr-id> <wi-ids>`.

Aplica **sólo si** `repo-config.yaml > tracker: azure-devops`. Si no
aplica, proponer el equivalente del tracker declarado o reportar que
no existe todavía.
