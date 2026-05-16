"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Event } from "@/domain/events/entities";
import { eventInputSchema, type EventInput } from "@/domain/events/schemas";

// R3.1–R3.6 (creación + validaciones de título y orden temporal).
// R4.1 (edición usa el mismo schema).
// R5.1, R5.2 — labels asociadas, errores con `aria-describedby` vía
// shadcn Form, foco al primer campo gestionado por Radix Dialog.

export type EventFormMode = { kind: "create"; defaultDay: string } | { kind: "edit"; event: Event };

export interface EventFormDialogProps {
  open: boolean;
  mode: EventFormMode | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: EventInput, mode: EventFormMode) => Promise<boolean>;
}

function emptyDefaults(day: string): EventInput {
  return {
    title: "",
    start: day,
    end: day,
    allDay: true,
  };
}

function eventToDefaults(e: Event): EventInput {
  return {
    title: e.title,
    start: e.start,
    end: e.end,
    allDay: e.allDay,
  };
}

function toAllDay(value: string): string {
  return value.slice(0, 10);
}

function toTimed(value: string): string {
  return value.length === 10 ? `${value}T09:00` : value;
}

export function EventFormDialog({
  open,
  mode,
  onOpenChange,
  onSubmit,
}: EventFormDialogProps): React.ReactElement {
  const defaults: EventInput =
    mode?.kind === "edit"
      ? eventToDefaults(mode.event)
      : emptyDefaults(mode?.kind === "create" ? mode.defaultDay : "");

  const form = useForm<EventInput>({
    resolver: zodResolver(eventInputSchema),
    defaultValues: defaults,
    mode: "onChange",
  });

  // Resetear cuando el modo cambia (reabrir con otro evento o crear).
  useEffect(() => {
    if (mode) form.reset(defaults);
    // intencional: re-sync sólo cuando cambia el modo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const allDay = form.watch("allDay");

  // Mantener formato de start/end consistente con `allDay`.
  useEffect(() => {
    const start = form.getValues("start");
    const end = form.getValues("end");
    if (allDay) {
      form.setValue("start", toAllDay(start), { shouldValidate: true });
      form.setValue("end", toAllDay(end), { shouldValidate: true });
    } else {
      form.setValue("start", toTimed(start), { shouldValidate: true });
      form.setValue("end", toTimed(end), { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDay]);

  // Validación cross-field (R3.6): cuando cambia un extremo del rango,
  // RHF sólo revalida ese campo y no propaga el error de Zod superRefine
  // al otro. Forzamos `trigger` sobre el extremo dependiente.
  useEffect(() => {
    const sub = form.watch((_, { name, type }) => {
      if (type !== "change") return;
      if (name === "start") void form.trigger("end");
      else if (name === "end") void form.trigger("start");
      else if (name === "allDay") void form.trigger(["start", "end"]);
    });
    return () => sub.unsubscribe();
  }, [form]);

  const handleValid = async (values: EventInput): Promise<void> => {
    if (!mode) return;
    const closed = await onSubmit(values, mode);
    if (closed) onOpenChange(false);
  };

  const isEdit = mode?.kind === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar evento" : "Nuevo evento"}</DialogTitle>
          <DialogDescription>
            Todos los campos se guardan en este navegador. Cierra con Escape o el botón Cancelar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleValid)}
            className="flex flex-col gap-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input autoFocus autoComplete="off" placeholder="Ej: Reunión 1:1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allDay"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      id="allDay"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  </FormControl>
                  <FormLabel htmlFor="allDay" className="cursor-pointer">
                    Todo el día
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inicio</FormLabel>
                    <FormControl>
                      <Input type={allDay ? "date" : "datetime-local"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fin</FormLabel>
                    <FormControl>
                      <Input type={allDay ? "date" : "datetime-local"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.formState.isValid}>
                {isEdit ? "Guardar cambios" : "Crear evento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
