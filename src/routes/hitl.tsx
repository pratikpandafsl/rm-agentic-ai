import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { useProtectedPage } from "@/lib/use-protected-page";

export const Route = createFileRoute("/hitl")({
  head: () => ({
    meta: [
      { title: "Human in the Loop · RM Agentic AI" },
      { name: "description", content: "Validate recommendations with account history, evidence, gaps, and field-level reviewer feedback." },
      { property: "og:title", content: "Human in the Loop · RM Agentic AI" },
      { property: "og:description", content: "Validate recommendations with account history, evidence, gaps, and field-level reviewer feedback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HitlRoute,
});

function HitlRoute() {
  const ready = useProtectedPage("HITL");
  if (!ready) return null;
  return <HitlPage />;
}

function HitlPage() {
  const { tenant } = useApp();
  const hitl = tenant.hitl;
  const [outcome, setOutcome] = useState(hitl.outcomeOptions[0] ?? "");
  const [action, setAction] = useState(hitl.recommendation);
  const [feedback, setFeedback] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setOutcome(hitl.outcomeOptions[0] ?? "");
    setAction(hitl.recommendation);
    setFeedback("");
    setSaved(false);
  }, [hitl]);

  return (
    <AppLayout active="HITL">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Human in the loop</h1>
        <p className="mt-1 text-sm text-muted-foreground">Validate recommendations with the account history, evidence and gaps visible beside the decision.</p>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <h2 className="border-b border-border px-4 py-3 text-base font-semibold text-foreground">{hitl.account} · Reconstructed history</h2>
          <div className="p-4">
            <ol className="ml-2 border-l border-primary/25">
              {hitl.history.map((item) => (
                <li key={`${item.date}-${item.event}`} className="relative pb-4 pl-5 last:pb-1">
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border border-primary bg-card" />
                  <p className="text-sm font-semibold text-foreground">{item.date} · {item.event}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                </li>
              ))}
            </ol>
            <h3 className="mt-3 text-base font-semibold text-foreground">Fields relied upon</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {hitl.fields.map((field) => <span key={field} className="rounded bg-muted px-2 py-1 text-[10px] text-foreground">{field}</span>)}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <h2 className="border-b border-border px-4 py-3 text-base font-semibold text-foreground">Operations decision</h2>
          <div className="space-y-3 p-4">
            <div className="border-l-2 border-primary bg-accent px-3 py-3">
              <p className="text-sm font-semibold text-foreground">Recommended: {hitl.recommendation}</p>
              <p className="mt-3 text-sm text-foreground">Confidence: {hitl.confidence}</p>
            </div>
            <div className="border-l-2 border-status-warning-foreground bg-status-warning px-3 py-2 text-sm text-foreground">
              <strong>Missing:</strong> {hitl.missing}
            </div>
            <div>
              <label htmlFor="review-outcome" className="mb-1 block text-xs font-semibold text-foreground">Review outcome</label>
              <select id="review-outcome" value={outcome} onChange={(event) => { setOutcome(event.target.value); setSaved(false); }} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground">
                {hitl.outcomeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="correct-action" className="mb-1 block text-xs font-semibold text-foreground">Correct action</label>
              <select id="correct-action" value={action} onChange={(event) => { setAction(event.target.value); setSaved(false); }} className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground">
                {hitl.actionOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="review-feedback" className="mb-1 block text-xs font-semibold text-foreground">Reason and field-level feedback</label>
              <textarea id="review-feedback" value={feedback} onChange={(event) => { setFeedback(event.target.value); setSaved(false); }} className="min-h-24 w-full resize-y rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => setSaved(true)}>Save and next</Button>
              {saved && <p role="status" className="text-sm text-status-success-foreground">Review saved. Ready for the next account.</p>}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
