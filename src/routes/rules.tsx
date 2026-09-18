import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Rules Library · RM Agentic AI — Mayo Phase 1" },
      {
        name: "description",
        content:
          "Create, simulate, approve and version deterministic Mayo guardrails.",
      },
      { property: "og:title", content: "Rules Library · RM Agentic AI — Mayo Phase 1" },
      {
        property: "og:description",
        content:
          "Create, simulate, approve and version deterministic Mayo guardrails.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RulesPage,
});

type Rule = {
  id: string;
  name: string;
  category: string;
  version: string;
  status: "Published" | "Draft";
};

const RULES: Rule[] = [
  { id: "R-001", name: "Timely filing", category: "Filing", version: "v3", status: "Published" },
  { id: "R-003", name: "Appeal window", category: "Appeal", version: "v4", status: "Draft" },
  { id: "R-007", name: "Underpayment evidence", category: "Financial", version: "v2", status: "Published" },
];

const THEN_OPTIONS = [
  "Action = APPEAL; HITL = Required",
  "Action = WRITE_OFF; HITL = Required",
  "Action = ESCALATE; HITL = Optional",
  "Action = NO_ACTION; HITL = None",
];

function RulesPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState<Rule | null>(null);
  const [ruleName, setRuleName] = useState("Appeal evidence and deadline");
  const [when, setWhen] = useState(
    "denial_is_appealable = true AND appeal_deadline >= today AND supporting_evidence = true",
  );
  const [then, setThen] = useState(THEN_OPTIONS[0]);
  const [source, setSource] = useState("Mayo SOP | Operations");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!getSession()) {
      navigate({ to: "/login" });
    }
    setChecked(true);
  }, [navigate]);

  if (!checked) return null;

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  };

  const handleEdit = (rule: Rule) => {
    setSelected(rule);
    setRuleName(`${rule.name} evidence and deadline`);
    flash(`Loaded ${rule.id} into the rule builder.`);
  };

  const handleCreateDraft = () => {
    setSelected(null);
    setRuleName("");
    setWhen("");
    setThen(THEN_OPTIONS[0]);
    setSource("");
    flash("New draft started.");
  };

  const handleSimulate = () => flash("Simulation complete: 12 accounts matched, 0 conflicts.");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    flash("Rule submitted for approval.");
  };

  const inputClass =
    "mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "block text-xs font-semibold text-foreground";

  return (
    <AppLayout active="Rules">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Rules Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, simulate, approve and version deterministic Mayo guardrails.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateDraft}
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create draft
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Rule library */}
        <section className="rounded-lg border border-border bg-card shadow-sm">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold text-foreground">
            Rule library
          </h2>
          <ul className="divide-y divide-border px-5">
            {RULES.map((rule) => (
              <li
                key={rule.id}
                className="flex items-center justify-between gap-3 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {rule.id} · {rule.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {rule.category} · {rule.version}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[11px] font-semibold",
                      rule.status === "Published"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700",
                    )}
                  >
                    {rule.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEdit(rule)}
                    className="rounded-md border border-input bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Rule builder */}
        <section className="rounded-lg border border-border bg-card shadow-sm">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold text-foreground">
            Rule builder
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
            <div>
              <label htmlFor="ruleName" className={labelClass}>
                Rule name
              </label>
              <input
                id="ruleName"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="when" className={labelClass}>
                WHEN
              </label>
              <textarea
                id="when"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                rows={3}
                className={cn(inputClass, "font-mono text-xs")}
              />
            </div>
            <div>
              <label htmlFor="then" className={labelClass}>
                THEN
              </label>
              <select
                id="then"
                value={then}
                onChange={(e) => setThen(e.target.value)}
                className={inputClass}
              >
                {THEN_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="source" className={labelClass}>
                Source / owner
              </label>
              <input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-1">
              {notice && (
                <span className="mr-auto text-xs font-medium text-green-700">
                  {notice}
                </span>
              )}
              <button
                type="button"
                onClick={handleSimulate}
                className="rounded-md border border-input bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
              >
                Simulate
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
