import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/project-setup")({
  head: () => ({
    meta: [
      { title: "Project Setup · RM Agentic AI — Mayo Phase 1" },
      {
        name: "description",
        content:
          "Bind client scope, data period, ground-truth policy and active configuration versions for the Mayo Phase 1 POC.",
      },
      { property: "og:title", content: "Project Setup · RM Agentic AI — Mayo Phase 1" },
      {
        property: "og:description",
        content:
          "Bind client scope, data period, ground-truth policy and active configuration versions for the Mayo Phase 1 POC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProjectSetupPage,
});

const PERIOD_OPTIONS = ["To be confirmed", "Last 30 days", "Last 90 days", "Last 12 months"];
const GROUND_TRUTH_OPTIONS = ["Paid accounts first", "Write-offs adjudicated", "All historical outcomes"];

function ProjectSetupPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [project, setProject] = useState("Mayo Phase 1 POC");
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0]);
  const [groundTruth, setGroundTruth] = useState(GROUND_TRUTH_OPTIONS[0]);
  const [environment, setEnvironment] = useState("TEST");
  const [goal, setGoal] = useState(
    "Reconstruct claim lifecycle, correlate evidence, determine current state/root cause and recommend one approved action.",
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      navigate({ to: "/login" });
    }
    setChecked(true);
  }, [navigate]);

  if (!checked) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  const inputClass =
    "mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "block text-sm font-semibold text-foreground";

  return (
    <AppLayout active="Project Setup">
      <h1 className="text-2xl font-semibold text-foreground">Project setup</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Bind client scope, data period, ground-truth policy and active
        configuration versions.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 rounded-lg border border-border bg-card p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label htmlFor="project" className={labelClass}>
              Project
            </label>
            <input
              id="project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="period" className={labelClass}>
              Selected period
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className={inputClass}
            >
              {PERIOD_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="groundTruth" className={labelClass}>
              Ground truth
            </label>
            <select
              id="groundTruth"
              value={groundTruth}
              onChange={(e) => setGroundTruth(e.target.value)}
              className={inputClass}
            >
              {GROUND_TRUTH_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="environment" className={labelClass}>
              Environment
            </label>
            <input
              id="environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="goal" className={labelClass}>
            Goal
          </label>
          <textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={4}
            className={inputClass}
          />
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm font-medium text-green-700">
              Version saved.
            </span>
          )}
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Save version
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
