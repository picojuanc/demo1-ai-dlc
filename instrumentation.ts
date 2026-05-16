// OpenTelemetry instrumentation entrypoint para Next 15.
// Se ejecuta una sola vez por proceso, antes de servir requests.
// Hoy es placeholder — cuando el OTEL_EXPORTER_OTLP_ENDPOINT esté
// configurado en `.env.local`, este archivo registra el SDK.

export async function register() {
  // TODO (T2): instalar y configurar @vercel/otel o @opentelemetry/sdk-node
  // según el deploy target final (ver stack/tech-stack.md § Deploy target).
}
