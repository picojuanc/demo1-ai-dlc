# Security

> **Estado**: TODO. Reglas de seguridad que el Service Agent debe
> aplicar y validar. El Security Agent (consultivo, §7) revisa las
> specs contra este archivo.

## Autenticación

- **Mecanismo**: TODO (OAuth2 + OIDC, JWT propio, mTLS, API key)
- **Proveedor de identidad**: TODO (identity-api interno, Azure AD,
  Auth0, Keycloak)
- **Manejo de tokens**: TODO (rotación, expiración, refresh)
- **Multi-tenant** (si aplica): TODO

## Autorización

- **Modelo**: TODO (RBAC, ABAC, ReBAC, ACL)
- **Dónde se aplica**: TODO (middleware, decorator en use cases,
  policy engine)
- **Granularidad**: TODO

## Secretos

- **Storage**: TODO (Sealed Secrets en OpenShift, Azure Key Vault, env
  vars de pipeline)
- **Rotación**: TODO (cada N días / on-demand)
- **Acceso desde código**: TODO (nunca hardcoded, nunca en logs, ver
  §14 del methodology *Sealed Secrets*)

## PII y residencia de datos

- **PII handled by this service**: TODO (lista explícita o `[]` si
  ninguna)
- **Política aplicable**: TODO (ver `.org/policies/pii-handling.md` si
  existe a nivel org)
- **Región de almacenamiento**: TODO (ej. EU-only para GDPR, US-only
  para HIPAA)
- **Retention**: TODO (cuánto tiempo se guarda cada categoría)
- **Anonymization**: TODO (cuándo y cómo se anonimiza)

## Compliance aplicable

- **Marcos**: TODO (GDPR, PCI-DSS, SOC2, HIPAA, ISO 27001, ninguno)
- **Auditoría**: TODO (logs de acceso, append-only ledger, etc.)
- **Consentimiento explícito** requerido para: TODO

## Encriptación

- **At rest**: TODO (encriptación de columna específica vs disco
  completo)
- **In transit**: TODO (TLS 1.2+, mTLS interno)
- **Algoritmos aprobados**: TODO

## Headers de seguridad (si aplica a API HTTP)

- TODO (CSP, HSTS, X-Frame-Options, CORS allowlist)

## Rate limiting / DDoS

- TODO (límite por IP, por user, por tenant)

## Validación de entrada

- **Patrón**: TODO (FluentValidation, Zod, class-validator, manual)
- **Sanitización HTML**: TODO (si aplica)

## Anti-patrones críticos de seguridad

> Estos son los "PROHIBIDO" más severos. Cualquier PR que los rompa se
> rechaza automáticamente.

- TODO (ej. *NUNCA loguear PII en plain text*)
- TODO (ej. *NUNCA exponer stack traces a clientes externos*)
- TODO (ej. *NUNCA usar secrets hardcoded — sólo via Sealed Secrets*)
