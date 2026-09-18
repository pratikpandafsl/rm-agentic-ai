import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { useProtectedPage } from "@/lib/use-protected-page";

export const Route = createFileRoute("/new-patterns")({
  head: () => ({
    meta: [
      { title: "New Patterns · RM Agentic AI" },
      { name: "description", content: "Review post-batch pattern candidates and prepare draft rules for human approval." },
      { property: "og:title", content: "New Patterns · RM Agentic AI" },
      { property: "og:description", content: "Review post-batch pattern candidates and prepare draft rules for human approval." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewPatternsRoute,
});

function NewPatternsRoute() {
  const ready = useProtectedPage("New Patterns");
  if (!ready) return null;
  return <NewPatternsPage />;
}

function NewPatternsPage() {
  const { tenant } = useApp();
  const patterns = tenant.patterns;
  const [notice, setNotice] = useState<string | null>(null);
  const [examplesFor, setExamplesFor] = useState<string | null>(null);

  return (
    <AppLayout active="New Patterns">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">New pattern discovery</h1>
          <p className="mt-1 text-sm text-muted-foreground">Post-batch candidates remain separate from decisions and never become live rules automatically.</p>
        </div>
        <Button onClick={() => setNotice(`Pattern discovery completed. ${patterns.length} candidates are ready for review.`)}>Discover patterns</Button>
      </div>

      {notice && <p role="status" className="mt-3 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground">{notice}</p>}

      <div className="mt-4 space-y-3">
        {patterns.map((pattern) => (
          <section key={pattern.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="text-base font-semibold text-foreground">{pattern.id} · {pattern.title}</h2>
              <span className={pattern.status === "New" ? "rounded bg-accent px-2 py-1 text-[10px] font-semibold text-primary" : "rounded bg-status-warning px-2 py-1 text-[10px] font-semibold text-status-warning-foreground"}>{pattern.status}</span>
            </div>
            <div className="px-4 py-3">
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-foreground">
                <p><strong>{pattern.accounts}</strong> supporting accounts</p>
                <p><strong>{pattern.consistency}%</strong> consistency</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pattern.fields.map((field) => <span key={field} className="rounded bg-muted px-2 py-1 text-[10px] text-foreground">{field}</span>)}
              </div>
              {examplesFor === pattern.id && (
                <div className="mt-3 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  Example accounts: {pattern.examples}
                </div>
              )}
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => setExamplesFor(examplesFor === pattern.id ? null : pattern.id)}>Open examples</Button>
                <Button onClick={() => setNotice(`Draft rule created from ${pattern.id}.`)}>Create draft rule</Button>
              </div>
            </div>
          </section>
        ))}
      </div>
    </AppLayout>
  );
}
