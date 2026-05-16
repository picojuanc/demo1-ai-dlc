# Branch flow — demo1-ai-dlc

> Flujo de promoción de ramas para este repo. Referenciado por
> `/spec-promote` y por el Service Agent al crear worktrees con
> `/spec-new`. Si tu organización usa otro flujo (GitFlow, trunk-based),
> ajusta este archivo y `/spec-promote` lo respetará.

## Ramas canónicas

| Rama | Ambiente | Quién despliega ahí | Gate de entrada |
|---|---|---|---|
| `pruebas` | dev / sandbox | merge automático tras tests verdes | Tests unit + integration verdes |
| `qa` | QA | merge tras QA sign-off | Tests verdes + state ≥ `partial-deploy-pruebas` |
| `main` | producción | merge tras Ops sign-off + rollout plan | State `feature-complete` + `rollout-plan.md` + Ops OK |

## Flujo

```
feat/<feature-slug>  ──►  pruebas  ──►  qa  ──►  main
        │                    │           │         │
        │                    │           │         └── deploy a OpenShift namespace prod (canary → 50% → 100%)
        │                    │           └── deploy a OpenShift namespace qa
        │                    └── deploy a OpenShift namespace dev
        └── worktree aislado por feature (§6 del methodology)
```

## Worktrees

Cada feature vive en su propio worktree (§6 *Worktree, ramas y flujo de
promoción* del methodology):

```bash
git worktree add -b feat/<feature-slug> ../demo1-ai-dlc--<feature-slug> origin/pruebas
```

El Service Agent (`/spec-new`) propone el comando y pide OK antes de
ejecutar.

## Feature flags

Las features en `qa` y `main` viajan **detrás de un feature flag** por
defecto (§6 del methodology). El flag de producción arranca `OFF` al
merge a `main`; se enciende progresivamente según el `rollout-plan.md`.

Limpieza del flag: §6 *Limpieza de feature flags* — task obligatoria
≤ 90 días tras 100% rollout.
