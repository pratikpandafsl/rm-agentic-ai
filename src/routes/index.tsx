import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · RM Agentic AI — Mayo Phase 1" },
      {
        name: "description",
        content:
          "A configurable, evidence-led accounts-receivable intelligence workflow with governed human validation. Track rules, sources, agents, POC runs, and HITL review for Mayo Phase 1.",
      },
      { property: "og:title", content: "Overview · RM Agentic AI — Mayo Phase 1" },
      {
        property: "og:description",
        content:
          "A configurable, evidence-led accounts-receivable intelligence workflow with governed human validation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OverviewPage,
});

const STATS = [
  { label: "Sample accounts", value: "10", hint: "Paid accounts first" },
  { label: "Approved sources", value: "4", hint: "Cross-source correlation" },
  { label: "Configured agents", value: "6", hint: "Versioned contracts" },
  { label: "Review queue", value: "2", hint: "Evidence and risk triggers" },
];

const LIFECYCLE_STEPS = [
  "Rules",
  "Upload",
  "Validate",
  "Agents",
  "Workflow",
  "Process",
  "Patterns",
  "Output",
  "HITL",
  "Measure",
];

function OverviewPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      navigate({ to: "/login" });
    }
    setChecked(true);
  }, [navigate]);

  if (!checked) return null;

  return (
    <AppLayout active="Overview">
      <h1 className="text-2xl font-semibold text-foreground">
        Mayo Phase 1 lifecycle
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A configurable, evidence-led AR intelligence workflow with governed
        human validation.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-5"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            Project lifecycle
          </h2>
        </div>
        <div className="flex flex-wrap gap-3 px-5 py-5">
          {LIFECYCLE_STEPS.map((step, i) => (
            <div
              key={step}
              className="flex w-24 flex-col items-center gap-2 rounded-lg border border-border bg-card px-3 py-4"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-r-md border-l-4 border-l-amber-500 bg-amber-50 px-4 py-3">
        <p className="text-sm text-amber-900">
          <span className="font-semibold">Ground-truth policy:</span> paid
          accounts provide positive path evidence. Historical write-offs,
          returns and adjustments remain context until Operations
          adjudicates them.
        </p>
      </div>
    </AppLayout>
  );
}
