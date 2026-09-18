import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/validation")({
  head: () => ({
    meta: [
      { title: "Validation and Learning · RM Agentic AI — Mayo Phase 1" },
      { name: "description", content: "Review adjudicated Mayo POC quality metrics and release considerations." },
      { property: "og:title", content: "Validation and Learning · RM Agentic AI — Mayo Phase 1" },
      { property: "og:description", content: "Review adjudicated Mayo POC quality metrics and release considerations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ValidationRoute,
});

const METRICS = [
  { label: "Adjudicated", value: "8", detail: "Locked outcomes" },
  { label: "Action exact match", value: "75%", detail: "6 of 8" },
  { label: "Evidence support", value: "96%", detail: "Material assertions" },
  { label: "Override rate", value: "25%", detail: "Reason coded" },
];

const CONSIDERATIONS = [
  "Report metrics by payer, action and confidence.",
  "Do not use historical write-offs as answer keys.",
  "Review critical errors independently from aggregate accuracy.",
  "Promote only versioned rules, agents and workflows that pass gates.",
];

function ValidationRoute() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getSession()) navigate({ to: "/login" });
    setChecked(true);
  }, [navigate]);

  if (!checked) return null;
  return <ValidationPage />;
}

function ValidationPage() {
  return (
    <AppLayout active="Validation">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Validation and learning</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Calculate quality using adjudicated accounts only. Reviewer feedback is curated, not automatically learned.
        </p>
      </div>

      <section aria-label="Validation metrics" className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
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
            {CONSIDERATIONS.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>
    </AppLayout>
  );
}