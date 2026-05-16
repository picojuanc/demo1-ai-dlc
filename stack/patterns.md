# Patterns — naming, commits, organización

> **Estado**: TODO. Convenciones de código que el Service Agent debe
> respetar al generar archivos en `/spec-implement` y al revisar PRs.

## Naming

> Define el patrón de nombre para cada tipo de archivo / símbolo. Sé
> específico — el Service Agent va a aplicar esto literalmente.

| Elemento | Patrón | Ejemplo |
|---|---|---|
| Entidad | TODO | TODO |
| Interface | TODO | TODO |
| Use case / Service | TODO | TODO |
| DTO | TODO | TODO |
| Controller / Handler | TODO | TODO |
| Repositorio | TODO | TODO |
| Migration | TODO | TODO |
| Test | TODO | TODO |

## Formato de commits

> El methodology (§11) impone el formato base; aquí registras
> particularidades de tu repo.

Formato:
```
<type>({{SERVICE_NAME}}): T<n> - <descripción corta> [R<x>.<y>] AB#<workitem-id>
```

Donde:
- `<type>`: `feat | fix | refactor | test | docs | chore | perf`
- `T<n>`: ID de la task en `tasks.md`
- `R<x>.<y>`: requirement EARS cubierto (puede ser lista
  `[R1.2, R1.3]`)
- `AB#<id>`: work item de Azure DevOps

Ejemplo:
```
feat({{SERVICE_NAME}}): T1 - <desc> [R1.3, R5.1] AB#12347
```

## Organización de tests

> El methodology obliga `// Derived from R*.*` antes de cada test (§5).
> Aquí defines el formato exacto en tu lenguaje.

- **Comentario de trazabilidad**: TODO (ej. `// Derived from R1.3`
  encima de cada `[Fact]` en xUnit; `// derived-from: R1.3` en
  Jest/Vitest)
- **Estructura de archivos**: TODO (ej. `<ArchivoBajoPrueba>Tests.cs`
  en `*.Tests/Unit/`)
- **Naming de métodos de test**: TODO (ej.
  `Should_<Behaviour>_When_<Condition>`, `it('returns X when Y')`)
- **Fixtures / setup compartido**: TODO

## Imports y módulos

- TODO (ej. *imports relativos sólo dentro del mismo módulo, absolutos
  cross-módulo; no allowed circular imports*)

## Formato y linting

- **Formatter**: TODO (ej. `dotnet format`, Prettier, `gofmt`, Black)
- **Linter**: TODO (ej. Roslyn analyzers, ESLint, golangci-lint, ruff)
- **Pre-commit hooks**: TODO

## Convenciones de error handling

- TODO (ej. *no excepciones para flujo de negocio; usar Result<T> +
  tipos de error específicos; sólo throw para casos verdaderamente
  excepcionales*)

## Logging

- **Nivel por defecto**: TODO (Info / Warning)
- **Formato**: TODO (JSON estructurado / texto plano)
- **Campos obligatorios**: TODO (`requestId`, `userId` hashed, etc.)
