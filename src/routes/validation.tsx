import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { useProtectedPage } from "@/lib/use-protected-page";

export const Route = createFileRoute("/validation")({
  head: () => ({
    meta: [
      { title: "Validation and Learning · RM Agentic AI" },
      { name: "description", content: "Review adjudicated POC quality metrics and release considerations." },
      { property: "og:title", content: "Validation and Learning · RM Agentic AI" },
      { property: "og:description", content: "Review adjudicated POC quality metrics and release considerations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ValidationRoute,
});

function ValidationRoute() {
  const ready = useProtectedPage("Validation");
  if (!ready) return null;
  return <ValidationPage />;
}

function ValidationPage() {
  const { tenant } = useApp();
  const data = tenant.validation;

  return (
    <AppLayout active="Validation">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Validation and learning</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Calculate quality using adjudicated accounts only. Reviewer feedback is curated, not automatically learned.
        </p>
      </div>

      <section aria-label="Validation metrics" className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <article key={metric.label} className="rounded-lg border border-border bg-card px-4 py-4 shadow-sm">
            <p className="text-[10px] font-medium uppercase text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{metric.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <h2 className="border-b border-border px-4 py-3 text-base font-semibold text-foreground">Release considerations</h2>
        <div className="px-7 py-7">
          <ul className="list-disc space-y-1 pl-4 text-sm text-foreground">
            {data.considerations.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>
    </AppLayout>
  );
}
