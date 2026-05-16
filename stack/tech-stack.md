# Tech stack

> **Estado**: TODO. Llenar con el Service Agent (modo conversacional) o
> manualmente. Mientras este archivo diga TODO, el Service Agent NO debe
> generar código.

## Lenguaje y runtime

- **Lenguaje**: TODO (ej. C#, TypeScript, Go, Python, Java, Kotlin)
- **Versión**: TODO (ej. .NET 9, Node 22, Go 1.23)
- **Runtime de deploy**: TODO (ej. `dotnet-9`, `node:22-alpine`,
  `golang:1.23`)

## Framework principal

- **Framework**: TODO (ej. ASP.NET Core, Express, Gin, FastAPI, Spring
  Boot)
- **Versión**: TODO
- **Razón**: TODO (por qué este framework — adopción interna, expertise
  del equipo, requisitos no funcionales)

## Persistencia

- **Base de datos**: TODO (ej. Postgres 16, SQL Server 2022, MongoDB 7)
- **Patrón de ownership** (§D7 del piloto): TODO
  - A — 1 servicio = 1 BD propia
  - B — schema dentro de BD compartida
  - C — solo lectura de BD ajena
- **ORM / driver**: TODO (ej. EF Core, Prisma, GORM, SQLAlchemy)
- **Migrations**: TODO (ej. EF Core migrations, Flyway, manual SQL en
  `Infrastructure/Database/Migrations/`)

## Mensajería / eventos (si aplica)

- **Broker**: TODO (ej. Kafka, RabbitMQ, Azure Service Bus, ninguno)
- **Patrón**: TODO (event sourcing, event-driven async, request/reply,
  ninguno)

## Cache (si aplica)

- **Tecnología**: TODO (ej. Redis, in-memory, ninguno)
- **Uso**: TODO (sesiones, query cache, rate limiting)

## API style

- **Estilo**: TODO (REST, GraphQL, gRPC, mixto)
- **Documentación**: TODO (OpenAPI, AsyncAPI, gRPC proto)
- **Ubicación de contratos**: TODO (`.org/contracts/` para
  cross-service, `docs/openapi.yaml` para interno)

## Observabilidad

- **Logs**: TODO (ej. Serilog → Loki, Winston → ELK)
- **Métricas**: TODO (Prometheus, Application Insights, Datadog)
- **Tracing**: TODO (OpenTelemetry, Jaeger)
- **APM**: TODO

## Build y empaquetado

- **Build tool**: TODO (ej. `dotnet build`, `npm`, `pnpm`, `gradle`)
- **Imagen base**: TODO (ej. `mcr.microsoft.com/dotnet/aspnet:9.0`)
- **CI**: Azure DevOps Pipelines (ver §13 del methodology)
- **CD**: OpenShift via ADO pipeline (ver §14 del methodology)

## Versiones congeladas

(Si decides pinear versiones específicas por compliance o reproducibilidad)

- TODO
