---
description: Abrir PR de promoción al siguiente ambiente declarado en repo-config.yaml
---

Ejecuta el flujo canónico de `/spec-promote` definido en
`AGENTS.md` § _Slash commands disponibles_ → _Definiciones canónicas_
→ `/spec-promote` para la feature `$ARGUMENTS`. Lee `repo-config.yaml`
para conocer `repo_type`, `tracker`, `environments` y `promotion_path`
— NO asumir `pruebas/qa/main` por reflejo.

Si AGENTS.md o `repo-config.yaml` no existen, **parar y reportar**.
