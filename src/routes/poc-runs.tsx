import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/poc-runs")({
  head: () => ({
    meta: [
      { title: "POC Runs · RM Agentic AI — Mayo Phase 1" },
      { name: "description", content: "Execute and monitor locked Mayo POC datasets, rules, agents and workflow snapshots." },
      { property: "og:title", content: "POC Runs · RM Agentic AI — Mayo Phase 1" },
      { property: "og:description", content: "Execute and monitor locked Mayo POC datasets, rules, agents and workflow snapshots." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PocRunsRoute,
});

const STAGES = ["Rules applied", "Timeline built", "Evidence correlated", "State & cause", "Action", "Review route"];

type Run = { id: string; accounts: number; dataset: string; workflow: string; status: string };

function PocRunsRoute() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getSession()) navigate({ to: "/login" });
    setChecked(true);
  }, [navigate]);

  if (!checked) return null;
  return <PocRunsPage />;
}

function PocRunsPage() {
  const [runs, setRuns] = useState<Run[]>([
    { id: "RUN-001", accounts: 10, dataset: "Mayo paid sample v1", workflow: "Workflow v1", status: "Completed with gaps" },
  ]);
  const [notice, setNotice] = useState<string | null>(null);

  const createRun = () => {
    if (runs.some((run) => run.id === "RUN-002")) {
      setNotice("RUN-002 is already queued.");
      return;
    }
    setRuns((current) => [...current, { id: "RUN-002", accounts: 10, dataset: "Mayo paid sample v1", workflow: "Workflow v1", status: "Queued" }]);
    setNotice("RUN-002 created and queued.");
  };

  return (
    <AppLayout active="POC Runs">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">POC runs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Execute a locked dataset, rule package, agent set and workflow snapshot.</p>
        </div>
        <button type="button" onClick={createRun} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Create run</button>
      </div>

      <section className="mt-4 overflow-x-auto rounded-lg border border-border bg-card p-3 shadow-sm">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead className="bg-muted/70 text-[10px] uppercase text-muted-foreground">
            <tr><th className="px-2 py-2 font-semibold">Run</th><th className="px-2 py-2 font-semibold">Accounts</th><th className="px-2 py-2 font-semibold">Dataset</th><th className="px-2 py-2 font-semibold">Workflow</th><th className="px-2 py-2 font-semibold">Status</th></tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id} className="border-t border-border text-sm text-foreground">
                <td className="px-2 py-3 font-semibold">{run.id}</td><td className="px-2 py-3">{run.accounts}</td><td className="px-2 py-3">{run.dataset}</td><td className="px-2 py-3">{run.workflow}</td>
                <td className="px-2 py-3"><span className={run.status === "Queued" ? "rounded bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground" : "rounded bg-secondary px-2 py-1 text-[10px] font-semibold text-secondary-foreground"}>{run.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {notice && <p role="status" className="px-2 pt-2 text-xs font-medium text-foreground">{notice}</p>}
      </section>

      <section className="mt-3 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <h2 className="border-b border-border px-4 py-3 text-base font-semibold text-foreground">Latest run stages</h2>
        <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {STAGES.map((stage) => (
            <div key={stage} className="flex min-h-16 flex-col items-center justify-center rounded-md border border-border px-3 py-2 text-center">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-primary"><Check className="h-4 w-4" /></span>
              <p className="mt-1 text-sm font-semibold text-foreground">{stage}</p>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}