// OpenTelemetry instrumentation entrypoint para Next 15.
// Se ejecuta una sola vez por proceso, antes de servir requests.
//
// Hoy: placeholder. Se enciende cuando exista un deploy target con
// OTLP collector (ver stack/tech-stack.md § Deploy target).
//
// Para activar OTel cuando llegue el momento:
//
//   import { registerOTel } from "@vercel/otel";
//   export function register() {
//     registerOTel({
//       serviceName: "demo1-ai-dlc",
//       traceExporter: "auto", // toma OTEL_EXPORTER_OTLP_ENDPOINT
//     });
//   }

export function register(): void {
  // No-op por ahora.
}
