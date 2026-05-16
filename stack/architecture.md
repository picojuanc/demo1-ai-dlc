# Architecture

> **Estado**: TODO. Define el patrón arquitectónico, la estructura de
> carpetas, y las reglas de dependencia entre capas.

## Patrón arquitectónico

- **Patrón principal**: TODO (Clean Architecture / Hexagonal / MVC /
  Vertical Slice / etc.)
- **Razón**: TODO

## Estructura de carpetas

> Define cómo se organiza `src/` y `tests/`. El Service Agent va a usar
> esto al generar archivos en `/spec-implement`.

```
src/
├── TODO
└── TODO

tests/
├── Unit/
├── Integration/
└── TODO
```

## Reglas de dependencia entre capas

> Si usas Clean Arch / Hexagonal, define qué capa puede depender de
> cuál. El Service Agent va a rechazar PRs que las violen.

- TODO (ej. *Domain no depende de nada externo. Application depende de
  Domain. Infrastructure depende de Application y Domain.
  Api/Controllers depende de Application.*)

## Componentes principales

| Componente | Responsabilidad | Carpeta |
|---|---|---|
| TODO | TODO | TODO |

## Diagrama (opcional)

```
TODO — diagrama ASCII de capas / contextos
```

## Integraciones externas

> Qué servicios externos toca este repo. El Service Agent debe crear
> `D-N` (Dependencies) en `requirements.md` para cada uno cuando aplique
> a una feature (§6 del methodology).

- TODO (ej. *identity-api para auth, ledger-service para escritura
  contable, Stripe Webhooks v1 para pagos*)

## Decisiones arquitectónicas (ADRs)

> Registrar decisiones importantes con un ADR corto. Ubicación:
> `decisions/NNNN-titulo.md`. Si la decisión afecta a varios repos,
> publicar también en `.org/decisions/`.

- TODO
