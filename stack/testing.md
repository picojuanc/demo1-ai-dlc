# Testing

> **Estado**: TODO. Niveles de test, cobertura mínima, herramientas. El
> Service Agent va a generar tests según estas reglas.

## Niveles obligatorios

| Nivel | Cuándo aplica | Herramienta | Cobertura mínima |
|---|---|---|---|
| Unit | TODO | TODO | TODO % |
| Integration | TODO | TODO | TODO % |
| Contract | si hay D-N cross-service | TODO (Pact, schemathesis) | 100% de D-N |
| E2E | si hay UI o flow multi-servicio | TODO (Playwright, Cypress) | flows críticos |
| Load | si hay NFR de p99 / throughput | TODO (k6, JMeter) | NFRs declarados |
| Accessibility | si hay UI | TODO (axe-core, lighthouse) | WCAG AA |

## Cobertura mínima global

- **Total**: TODO % (recomendado ≥ 80%)
- **Excepciones permitidas**: TODO (ej. *generated code, DTOs sin
  lógica, Program.cs / Startup.cs*)

## Trazabilidad spec ↔ test

Cada test cita su requirement de origen. Formato según `patterns.md` §
*Organización de tests*. El comentario es **obligatorio**:

```
// Derived from R1.3
[Fact]
public async Task Should_AppendLedgerRow_When_PointsEarned() { ... }
```

`/spec-verify` audita esta trazabilidad. Tests sin `// Derived from
R*.*` o con un `R*.*` que ya no existe en `requirements.md` se
reportan como gaps.

## Estrategia por requirement

En `requirements.md`, cada `R*.*` declara su nivel de test:

```markdown
### R1.3 — Append-only ledger
WHEN puntos se acreditan THEN sistema SHALL escribir fila en
`points_ledger` sin UPDATE/DELETE posterior.
Tests: unit, integration
```

## Mocking

- **Política general**: TODO (ej. *mockear sólo lo externo al repo
  (otros servicios via HTTP, vendors); BD real con Testcontainers*)
- **Mocks de servicios externos**: ubicación TODO (ej. `tests/mocks/`)
- **Cuándo retirar un mock**: `Ready to unmock: <condición>` declarado
  en el archivo del mock (§6 del methodology *Mocks*).

## Datos de prueba

- **Fixtures**: TODO (ubicación, formato)
- **Seeding**: TODO (script automático antes de integration tests)
- **Cleanup**: TODO (rollback de transacción, drop schema, etc.)

## CI

- **Tests bloqueantes**: TODO (cuáles bloquean merge)
- **Tests no bloqueantes**: TODO (cuáles corren pero no bloquean —
  ej. load tests nightly)
- **Pipeline YAML**: `<repo>/azure-pipelines.yml` (referenciado en §13
  del methodology)
