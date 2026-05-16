# Constraints — qué está prohibido en este repo

> **Estado**: TODO. Anti-patrones específicos del proyecto. El Service
> Agent rechaza PRs que los violen. Mantén esta lista corta y específica
> — anti-patrones genéricos de seguridad viven en `security.md`.

## Datos

- TODO (ej. *NUNCA hacer UPDATE/DELETE en la tabla `points_ledger`:
  append-only por R5.1*)
- TODO

## Lógica de negocio

- TODO (ej. *Cálculos de saldo SIEMPRE en el servicio, NUNCA en el
  cliente*)
- TODO

## Capas / dependencias

- TODO (ej. *Controllers NO pueden tocar Repositories directo — siempre
  vía Use Case*)
- TODO

## Tests

- TODO (ej. *NO mockear la BD en tests de integración — usar
  Testcontainers Postgres real*)
- TODO (ej. *NO escribir tests que dependan del orden de ejecución*)

## Performance

- TODO (ej. *NO hacer N+1 queries — usar `Include` o batch fetch*)
- TODO

## Información expuesta a clientes

- TODO (ej. *Endpoint público que retorne 404 si user no enrolled
  debe ser indistinguible del 404 de user inexistente — information
  disclosure*)
- TODO

## Deploy

- TODO (ej. *NO desplegar a prod sin canary 5% mínimo 24h*)
- TODO

## Convenciones de código

- TODO (ej. *NO usar `Task.Result` o `Wait()` — deadlock risk en
  ASP.NET*)
- TODO
