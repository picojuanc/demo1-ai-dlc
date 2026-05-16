import type { Metadata } from "next";

import { CalendarApp } from "./calendarApp";

export const metadata: Metadata = {
  title: "Calendario",
  description: "Tu calendario personal de eventos, guardado localmente.",
};

export default function CalendarPage(): React.ReactElement {
  return <CalendarApp />;
}
