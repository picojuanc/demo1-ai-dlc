// Value Objects del bounded context events.

export type EventKind =
  | "single-day-timed"
  | "single-day-allday"
  | "multi-day-timed"
  | "multi-day-allday";

export interface DateRange {
  start: string;
  end: string;
}
