import type { ZodError } from "zod";

import type { EventValidationError } from "@/domain/events/errors";

export function toValidationError(error: ZodError): EventValidationError {
  return {
    kind: "validation",
    issues: error.issues.map((i) => ({
      path: i.path,
      message: i.message,
    })),
  };
}
