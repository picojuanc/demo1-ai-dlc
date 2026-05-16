import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">demo1-ai-dlc</h1>
      <p className="max-w-prose text-muted-foreground">
        Aplicación demo del methodology AI-DLC. La feature{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-sm">events-calendar</code> está en
        construcción (ver{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-sm">specs/events-calendar/</code>
        ).
      </p>
      <Link
        href="/calendar"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
      >
        Ir al calendario (próximamente)
      </Link>
    </main>
  );
}
