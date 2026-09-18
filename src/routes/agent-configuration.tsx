import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { useProtectedPage } from "@/lib/use-protected-page";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agent-configuration")({
  head: () => ({
    meta: [
      { title: "Agent Configuration · RM Agentic AI" },
      { name: "description", content: "Configure agent models, instructions, schemas and confidence thresholds." },
      { property: "og:title", content: "Agent Configuration · RM Agentic AI" },
      { property: "og:description", content: "Configure agent models, instructions, schemas and confidence thresholds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AgentConfigurationRoute,
});

function AgentConfigurationRoute() {
  const ready = useProtectedPage("Agent Configuration");
  if (!ready) return null;
  return <AgentConfigurationPage />;
}

function AgentConfigurationPage() {
  const { tenant } = useApp();
  const agents = tenant.agents;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [model, setModel] = useState("Deterministic only");
  const [instruction, setInstruction] = useState(
    "Use supplied evidence only. Distinguish facts from inference. Cite fields. Return schema-valid JSON.",
  );
  const [schema, setSchema] = useState(agents[0]?.schema ?? "");
  const [threshold, setThreshold] = useState("0.8");
  const [notice, setNotice] = useState<string | null>(null);
  const selected = agents[selectedIndex] ?? agents[0]!;

  useEffect(() => {
    setSelectedIndex(0);
    setSchema(agents[0]?.schema ?? "");
    setNotice(null);
  }, [agents]);

  const selectAgent = (index: number) => {
    const nextAgent = agents[index];
    if (!nextAgent) return;
    setSelectedIndex(index);
    setSchema(nextAgent.schema);
    setNotice(null);
  };

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  };

  return (
    <AppLayout active="Agent Configuration">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Agent configuration</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Version role, model, prompt, tools, thresholds and structured output contract.
        </p>
      </div>

      <div className="mt-4 grid min-h-[600px] grid-cols-1 gap-3 xl:grid-cols-[184px_minmax(360px,1fr)_280px]">
        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <h2 className="border-b border-border px-3 py-3 text-sm font-semibold text-foreground">
            {agents.length} {tenant.shortName} agents
          </h2>
          <div className="space-y-1.5 p-3">
            {agents.map((agent, index) => (
              <button
                key={agent.name}
                type="button"
                onClick={() => selectAgent(index)}
                className={cn(
                  "w-full rounded-md border px-2 py-2 text-left transition-colors",
                  selectedIndex === index ? "border-primary bg-accent" : "border-border bg-card hover:bg-muted/60",
                )}
              >
                <span className="block text-sm font-semibold leading-5 text-foreground">{agent.name}</span>
                <span className="block text-[11px] text-muted-foreground">{agent.schema}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">{selected.name}</h2>
          <div className="px-4 py-6">
            <p className="text-sm text-foreground">{selected.description}</p>
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <span className="rounded bg-secondary px-2 py-1 text-[10px] font-semibold text-secondary-foreground">Enabled</span>
              <p className="mt-4 text-sm font-semibold text-foreground">Input → reasoning/validation → schema output</p>
              <p className="mt-2 text-xs text-muted-foreground">Every result records run, agent, schema and model versions.</p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <h2 className="border-b border-border px-3 py-3 text-sm font-semibold text-foreground">Configuration</h2>
          <div className="space-y-2 p-3">
            <label className="block text-[11px] font-semibold text-foreground">Approved model
              <select value={model} onChange={(event) => setModel(event.target.value)} className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground">
                <option>Deterministic only</option><option>Approved language model</option>
              </select>
            </label>
            <label className="block text-[11px] font-semibold text-foreground">Instruction
              <textarea value={instruction} onChange={(event) => setInstruction(event.target.value)} rows={4} className="mt-1 w-full resize-none rounded-md border border-input bg-background p-2 text-xs text-foreground" />
            </label>
            <label className="block text-[11px] font-semibold text-foreground">Output schema
              <select value={schema} onChange={(event) => setSchema(event.target.value)} className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground">
                {agents.map((agent) => <option key={agent.schema}>{agent.schema}</option>)}
              </select>
            </label>
            <label className="block text-[11px] font-semibold text-foreground">Confidence threshold
              <input type="number" min="0" max="1" step="0.1" value={threshold} onChange={(event) => setThreshold(event.target.value)} className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground" />
            </label>
            <div className="rounded-md bg-sidebar p-2.5 text-sidebar-primary-foreground">
              <p className="text-xs font-semibold">Output pattern</p>
              <code className="mt-1 block whitespace-normal text-[10px] leading-4">{"{ status, result, confidence, supporting_fields, missing_fields, lineage }"}</code>
            </div>
            {notice && <p role="status" className="text-xs font-medium text-foreground">{notice}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => flash(`${selected.name} test passed.`)} className="rounded-md border border-input bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent">Test</button>
              <button type="button" onClick={() => flash(`${selected.name} version saved.`)} className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">Save version</button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
