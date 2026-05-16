# Requirements — events-calendar

> **Feature**: `events-calendar`
> **Servicio**: `demo1-ai-dlc`
> **Initiative**: NONE
> **Work item**: ninguno (feature standalone del demo)
> **Estado**: borrador para aprobación. OQ-1 resuelta (ver R1.4).

## Contexto / problema

El usuario quiere un calendario personal en una sola persona / un solo
dispositivo para **organizar tareas con fechas**: crear eventos en un
día (con horas o "todo el día"), eventos multi-día (con o sin horas)
y marcar cada evento como **hecho** o **no hecho**.

El servicio es **stateless en el servidor**: el calendario vive
íntegramente en `localStorage` del navegador del usuario. No hay
backend de datos, no hay autenticación, no hay API REST de
persistencia. Next.js sólo sirve la UI (RSC + componentes cliente que
manipulan `localStorage`).

## Alcance v1

- **Incluido**: CRUD de eventos, toggle hecho/no hecho, vistas mes +
  día, validaciones mínimas, accessibility WCAG AA, idioma español.
- **Excluido (no negocia v1)**: recurrencia, categorías/colores,
  descripción/notas, múltiples dispositivos, sincronización, auth,
  exportar/importar, recordatorios, i18n.

## Requirements (EARS)

### R1 — Persistencia local

#### R1.1 — Persistencia en localStorage
WHEN el usuario crea, edita, borra o cambia el estado de un evento
THEN el sistema SHALL persistir el cambio en `localStorage` del
navegador, sin enviar datos al servidor.
Tests: unit, integration

#### R1.2 — Carga inicial
WHEN la aplicación carga (cliente) THEN el sistema SHALL leer el
estado de `localStorage`. IF la clave no existe o está vacía THEN
el sistema SHALL mostrar el calendario sin eventos (empty state) sin
generar errores en consola.
Tests: unit, e2e

#### R1.3 — Schema versionado
El estado persistido en `localStorage` SHALL incluir un campo
`version: number` para permitir migraciones futuras sin pérdida de
datos. El lector SHALL rechazar formatos con `version` desconocida y
mostrar un mensaje de error en español sin sobrescribir los datos.
Tests: unit

#### R1.4 — Disponibilidad de localStorage
WHEN la aplicación carga (cliente) AND `localStorage` no está
disponible (no soportado por el navegador, deshabilitado por
configuración, modo de navegación con almacenamiento restringido como
Safari incógnito, o falla al intentar una escritura de prueba) THEN
el sistema SHALL bloquear el uso de la aplicación y mostrar un
mensaje a pantalla completa en español que explique:

- Que **la aplicación requiere almacenamiento local del navegador**
  para funcionar.
- Que el usuario debe **habilitar el almacenamiento local** o salir
  del modo de navegación privada.

WHILE esta condición persiste, el sistema SHALL NOT mostrar el
calendario, formularios de evento ni ningún otro control de gestión
(la única UI visible es el mensaje de bloqueo). No se reintenta la
detección automáticamente; el usuario recarga la página después de
habilitar.

Tests: unit (detección), e2e (UI bloqueada con mensaje), a11y (el
mensaje cumple WCAG AA)

### R2 — Visualización del calendario

#### R2.1 — Vista mensual por defecto
La vista por defecto al cargar la app SHALL ser **mensual**,
mostrando todos los eventos del mes actual del dispositivo.
Tests: e2e, a11y

#### R2.2 — Vista de día por click
WHEN el usuario clickea (o activa por teclado) una celda de día
THEN el sistema SHALL mostrar la lista de eventos de ese día en
orden cronológico (eventos "todo el día" primero, luego por hora
de inicio ascendente).
Tests: e2e

#### R2.3 — Navegación entre meses
El usuario SHALL poder navegar al mes anterior, al mes siguiente y
volver al mes actual mediante controles visibles y operables por
teclado.
Tests: e2e, a11y

#### R2.4 — Eventos multi-día visibles en cada celda
WHERE un evento abarca más de un día THE SYSTEM SHALL mostrarlo
visualmente en **cada celda de día** que el evento atraviesa dentro
del rango visible.
Tests: unit (cálculo de rango), e2e (UI)

### R3 — Creación de eventos

#### R3.1 — Evento de un día con horas
El usuario SHALL poder crear un evento que ocurre en **un solo día**
con hora de inicio y hora de fin dentro del mismo día.
Tests: unit, e2e

#### R3.2 — Evento de un día, todo el día
El usuario SHALL poder crear un evento que ocurre en **un solo día**
marcado como "todo el día" (sin horas).
Tests: unit, e2e

#### R3.3 — Evento multi-día completo
El usuario SHALL poder crear un evento que abarca **varios días
consecutivos** marcado como "todos los días completos" (sin horas).
Tests: unit, e2e

#### R3.4 — Evento multi-día con horas
El usuario SHALL poder crear un evento que empieza en una fecha y
hora específica y termina en una fecha (distinta a la de inicio) y
hora específica.
Tests: unit, e2e

#### R3.5 — Validación de título
IF el título del evento está vacío o contiene sólo espacios THEN el
sistema SHALL rechazar la creación / edición y mostrar el mensaje
en español **"El título es obligatorio"** asociado al campo. El
submit SHALL quedar deshabilitado hasta que el título sea válido.
Tests: unit, e2e

#### R3.6 — Validación de orden temporal
IF la fecha/hora de fin es anterior a la fecha/hora de inicio THEN
el sistema SHALL rechazar la creación / edición y mostrar el mensaje
en español **"El fin no puede ser anterior al inicio"** asociado al
campo de fin. El submit SHALL quedar deshabilitado hasta que el rango
sea válido.
Tests: unit, e2e

### R4 — Mutación de eventos

#### R4.1 — Editar evento
El usuario SHALL poder editar todos los campos de un evento
existente (título, fechas, horas, modo "todo el día / con horas /
multi-día"). Las mismas validaciones de R3.5 y R3.6 aplican a la
edición.
Tests: unit, e2e

#### R4.2 — Borrar evento
El usuario SHALL poder borrar un evento. WHEN el usuario activa la
acción de borrar THEN el sistema SHALL pedir confirmación explícita
en español antes de eliminar definitivamente.
Tests: unit, e2e

#### R4.3 — Marcar hecho / no hecho
Cada evento SHALL tener un estado binario `done | not-done`
inicializado en `not-done` al crearse. El usuario SHALL poder
alternar el estado desde la vista de día y desde la vista de
edición. El cambio se persiste según R1.1.
Tests: unit, e2e

### R5 — Accessibility

#### R5.1 — WCAG AA en vistas y modales
Toda vista (mensual, día) y toda modal (crear, editar, confirmar
borrado) SHALL cumplir WCAG AA, incluyendo contraste, semántica de
landmarks, manejo de foco al abrir/cerrar modales y nombres
accesibles para controles.
Tests: a11y (axe-core en e2e)

#### R5.2 — Navegación por teclado
Todas las operaciones de R2–R4 SHALL ser ejecutables sólo con
teclado: navegar entre días, abrir vista de día, crear evento,
editar, borrar, toggle hecho, navegar entre meses. El foco SHALL ser
visible en todo momento.
Tests: a11y, e2e

## Datos y formato

- **Fechas**: se persisten como strings en formato local sin
  conversión a UTC. Convención: `YYYY-MM-DDTHH:mm` para eventos con
  hora, `YYYY-MM-DD` para "todo el día". El timezone es el del
  dispositivo en tiempo de creación.
- **IDs**: cada evento tiene un identificador único (formato a definir
  en `design.md`).
- **Validación de schema**: el contenido de `localStorage` se valida
  con Zod al cargar (R1.2, R1.3).

## Dependencies (D-N)

**Ninguna**. La feature no consume ni publica servicios externos. No
hay contratos cross-team. No hay endpoints REST nuevos en
`/api/*` para esta feature.

## Tests strategy (resumen)

| Nivel | Aplica a | Herramienta |
|---|---|---|
| Unit | R1.x (parser/persistence, detección de localStorage), R2.4 (cálculo de rango), R3.x, R4.x (lógica de mutación, validaciones) | Vitest |
| Integration | R1.1 (write + read en harness de jsdom) | Vitest + jsdom |
| E2E | R1.4 (UI de bloqueo), R2.x, R3.x, R4.x (flows de UI) | Playwright |
| A11y | R5.x (incluye R2.x y R3.x renderizadas) | axe-core dentro de Playwright |
| Contract | — | N/A (sin API REST) |
| Load | — | N/A (sin NFRs de performance declarados) |

Cada test cita su requirement con `// Derived from R<x>.<y>`
(obligatorio, ver `stack/testing.md`).

## OPEN_QUESTIONs

_Ninguna activa._

### Historial

- **OQ-1** — Comportamiento con `localStorage` no disponible.
  **Resuelta** (2026-05-16) con opción **(a)**: bloquear la app y
  mostrar mensaje. Materializada en **R1.4**.

## Aprobación

- **G2 (Feature spec)**: pendiente firma del tech lead (Juan Pico,
  `jpico@syc.com.co`). **Sin bloqueantes** — listo para revisión.
- **Tras G2**: pasar a `design.md` con DEC-N (modelo de datos,
  composición de Clean Arch en client-side, librerías para
  manejo de fechas, detección concreta de `localStorage` para R1.4).
