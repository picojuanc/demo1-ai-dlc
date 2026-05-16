"use client";

import { useEffect, useRef } from "react";

// R1.4 — vista fullscreen mostrada cuando `localStorage` no está
// disponible. Cumple R5.1 (WCAG AA): main landmark, jerarquía de
// headings, foco inicial en el h1, sin controles activos.

export function LocalStorageUnavailable(): React.ReactElement {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main
      role="main"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center text-foreground"
    >
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="max-w-prose text-3xl font-semibold tracking-tight outline-none"
      >
        Esta aplicación necesita almacenamiento local
      </h1>
      <p className="max-w-prose text-base text-muted-foreground">
        El calendario guarda tus eventos directamente en el navegador y requiere{" "}
        <strong>almacenamiento local</strong> para funcionar. No se envía nada a un servidor.
      </p>
      <p className="max-w-prose text-base text-muted-foreground">
        Por favor, habilita el almacenamiento del sitio o sal del modo de navegación privada, y
        luego recarga la página.
      </p>
    </main>
  );
}
