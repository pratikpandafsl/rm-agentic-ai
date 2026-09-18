import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/workflow-designer")({
  head: () => ({
    meta: [
      { title: "Workflow Designer · RM Agentic AI — Mayo Phase 1" },
      { name: "description", content: "Configure the ordered Mayo evidence workflow, retries, failure route and human review gate." },
      { property: "og:title", content: "Workflow Designer · RM Agentic AI — Mayo Phase 1" },
      { property: "og:description", content: "Configure the ordered Mayo evidence workflow, retries, failure route and human review gate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WorkflowDesignerRoute,
});

type WorkflowAgent = { id: number; name: string; enabled: boolean };

const INITIAL_AGENTS: WorkflowAgent[] = [
  { id: 1, name: "Data Validation Agent", enabled: true },
  { id: 2, name: "Timeline Reconstruction Agent", enabled: true },
  { id: 3, name: "Evidence Correlation Agent", enabled: true },
  { id: 4, name: "State & Root Cause Agent", enabled: true },
  { id: 5, name: "Next Action Agent", enabled: true },
  { id: 6, name: "Review Routing Agent", enabled: true },
];

function WorkflowDesignerRoute() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getSession()) navigate({ to: "/login" });
    setChecked(true);
  }, [navigate]);

  if (!checked) return null;
  return <WorkflowDesignerPage />;
}

function WorkflowDesignerPage() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [notice, setNotice] = useState<string | null>(null);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= agents.length) return;
    setAgents((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setNotice(null);
  };

  const toggle = (id: number) => {
    setAgents((current) => current.map((agent) => agent.id === id ? { ...agent, enabled: !agent.enabled } : agent));
    setNotice(null);
  };

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  };

  return (
    <AppLayout active="Workflow Designer">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Workflow designer</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure the ordered Mayo sequence, retries, failure route and HITL gate.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => flash("Workflow validation passed.")} className="rounded-md border border-input bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent">Validate</button>
          <button type="button" onClick={() => flash("Workflow v1 published.")} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Publish</button>
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <h2 className="border-b border-border px-4 py-3 text-base font-semibold text-foreground">Mayo Evidence Workflow v1</h2>
        <div className="space-y-1.5 p-3">
          {agents.map((agent, index) => (
            <div key={agent.id} className="flex min-h-14 items-center gap-3 rounded-md border border-border px-2 py-2 sm:px-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{agent.name}</p>
                <p className="text-[11px] text-muted-foreground">Retry 1 · Failure: Operations review</p>
              </div>
              <span className={agent.enabled ? "rounded bg-secondary px-2 py-1 text-[10px] font-semibold text-secondary-foreground" : "rounded bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground"}>{agent.enabled ? "Enabled" : "Disabled"}</span>
              <div className="flex shrink-0 gap-1">
                <button type="button" aria-label={`Move ${agent.name} up`} title="Move up" disabled={index === 0} onClick={() => move(index, -1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-card text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" aria-label={`Move ${agent.name} down`} title="Move down" disabled={index === agents.length - 1} onClick={() => move(index, 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-card text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => toggle(agent.id)} className="min-w-16 rounded-md border border-input bg-card px-2 text-sm font-semibold text-foreground hover:bg-accent">{agent.enabled ? "Disable" : "Enable"}</button>
              </div>
            </div>
          ))}
          {notice && <p role="status" className="px-1 pt-2 text-xs font-medium text-foreground">{notice}</p>}
        </div>
      </section>
    </AppLayout>
  );
}