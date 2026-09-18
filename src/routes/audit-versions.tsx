import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/audit-versions")({
  head: () => ({
    meta: [
      { title: "Audit and Versions · RM Agentic AI — Mayo Phase 1" },
      { name: "description", content: "Replay Mayo POC decisions across sources, mappings, rules, agents, workflows, models, and reviewers." },
      { property: "og:title", content: "Audit and Versions · RM Agentic AI — Mayo Phase 1" },
      { property: "og:description", content: "Replay Mayo POC decisions across sources, mappings, rules, agents, workflows, models, and reviewers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuditVersionsRoute,
});

const EVENTS = [
  { time: "Now", event: "Review saved", actor: "Operations SME", object: "MAYO-000207" },
  { time: "11:20", event: "Workflow published", actor: "Technology Admin", object: "Workflow v2" },
  { time: "10:05", event: "Run completed", actor: "System", object: "RUN-001" },
  { time: "09:40", event: "Rule package published", actor: "Rule Admin", object: "Mayo Rules v3" },
];

function AuditVersionsRoute() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getSession()) navigate({ to: "/login" });
    setChecked(true);
  }, [navigate]);

  if (!checked) return null;
  return <AuditVersionsPage />;
}

function AuditVersionsPage() {
  return (
    <AppLayout active="Audit & Versions">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Audit and versions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Replay any decision across source, mapping, rules, agents, workflow, model and reviewer.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card p-4 shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">Recent audit events and version changes</caption>
          <thead className="bg-muted/70 text-[10px] uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">Time</th>
              <th scope="col" className="px-3 py-2 font-medium">Event</th>
              <th scope="col" className="px-3 py-2 font-medium">Actor</th>
              <th scope="col" className="px-3 py-2 font-medium">Object</th>
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((entry) => (
              <tr key={`${entry.time}-${entry.event}`} className="border-t border-border">
                <td className="px-3 py-3 text-foreground">{entry.time}</td>
                <td className="px-3 py-3 text-foreground">{entry.event}</td>
                <td className="px-3 py-3 text-foreground">{entry.actor}</td>
                <td className="px-3 py-3 text-foreground">{entry.object}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}