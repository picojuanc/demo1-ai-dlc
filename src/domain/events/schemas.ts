import { z } from "zod";

// Fuente de verdad del shape de Event: estos schemas Zod.
// Los types `Event` y `EventInput` se infieren a partir de aquí
// (entities.ts los re-exporta con nombres semánticos).

const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
const dateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function applyDateRules(
  e: { allDay: boolean; start: string; end: string },
  ctx: z.RefinementCtx,
): void {
  const fmt = e.allDay ? dateOnly : dateTime;
  if (!fmt.test(e.start)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["start"],
      message: "Formato de fecha inválido",
    });
  }
  if (!fmt.test(e.end)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["end"],
      message: "Formato de fecha inválido",
    });
  }
  if (e.end < e.start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["end"],
      message: "El fin no puede ser anterior al inicio",
    });
  }
}

// Schema usado por el form (sin id/createdAt/updatedAt/status — los pone el use case).
export const eventInputSchema = z
  .object({
    title: z.string().trim().min(1, "El título es obligatorio"),
    start: z.string(),
    end: z.string(),
    allDay: z.boolean(),
  })
  .superRefine(applyDateRules);

export type EventInput = z.infer<typeof eventInputSchema>;

// Schema canónico de Event tal como vive en localStorage.
export const eventSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(1, "El título es obligatorio"),
    start: z.string(),
    end: z.string(),
    allDay: z.boolean(),
    status: z.enum(["done", "not-done"]),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .superRefine(applyDateRules);

export type Event = z.infer<typeof eventSchema>;

// Schema del documento persistido completo.
export const persistedSchema = z.object({
  version: z.literal(1),
  events: z.array(eventSchema),
});

export type Persisted = z.infer<typeof persistedSchema>;
