"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Event } from "@/domain/events/entities";

// R4.2 — confirmación explícita antes de borrar.
// R5.1 — `AlertDialog` provee focus trap, devolución de foco al
// trigger y semántica WAI-ARIA correcta.

export interface DeleteEventDialogProps {
  open: boolean;
  event: Event | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (event: Event) => Promise<void>;
}

export function DeleteEventDialog({
  open,
  event,
  onOpenChange,
  onConfirm,
}: DeleteEventDialogProps): React.ReactElement {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Borrar este evento?</AlertDialogTitle>
          <AlertDialogDescription>
            {event
              ? `Vas a borrar "${event.title}". Esta acción no se puede deshacer.`
              : "Esta acción no se puede deshacer."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              if (event) await onConfirm(event);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Borrar evento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
