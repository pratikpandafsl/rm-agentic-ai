import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { useProtectedPage } from "@/lib/use-protected-page";

export const Route = createFileRoute("/audit-versions")({
  head: () => ({
    meta: [
      { title: "Audit and Versions · RM Agentic AI" },
      { name: "description", content: "Replay decisions across sources, mappings, rules, agents, workflows, models and reviewers." },
      { property: "og:title", content: "Audit and Versions · RM Agentic AI" },
      { property: "og:description", content: "Replay decisions across sources, mappings, rules, agents, workflows, models and reviewers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuditVersionsRoute,
});

function AuditVersionsRoute() {
  const ready = useProtectedPage("Audit & Versions");
  if (!ready) return null;
  return <AuditVersionsPage />;
}

function AuditVersionsPage() {
  const { tenant } = useApp();

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
            {tenant.audit.map((entry) => (
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
