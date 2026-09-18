import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Briefcase,
  Scale,
  Database,
  ShieldCheck,
  SlidersHorizontal,
  Workflow,
  Target,
  Newspaper,
  Sparkles,
  FileText,
  User,
  TrendingUp,
  History,
  Play,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { getSession, signOut, type DummySession } from "@/lib/auth";
import { cn } from "@/lib/utils";

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

const NAV_ITEMS: { label: string; icon: LucideIcon; active?: boolean }[] = [
  { label: "Overview", icon: LayoutGrid, active: true },
  { label: "Project Setup", icon: Briefcase },
  { label: "Rules", icon: Scale },
  { label: "Data Sources", icon: Database },
  { label: "Mapping & Quality", icon: ShieldCheck },
  { label: "Agent Configuration", icon: SlidersHorizontal },
  { label: "Workflow Designer", icon: Workflow },
  { label: "POC Runs", icon: Target },
  { label: "Account Results", icon: Newspaper },
  { label: "New Patterns", icon: Sparkles },
  { label: "Output File", icon: FileText },
  { label: "HITL", icon: User },
  { label: "Validation", icon: TrendingUp },
  { label: "Audit & Versions", icon: History },
];

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
  const [session, setSession] = useState<DummySession | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate({ to: "/login" });
    } else {
      setSession(s);
    }
    setChecked(true);
  }, [navigate]);

  if (!checked || !session) return null;

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-primary-foreground">
              RM Agentic AI
            </p>
            <p className="text-xs text-sidebar-foreground/70">Mayo Phase 1</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    item.active
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 px-3 pb-4">
          <div className="rounded-md border border-sidebar-border px-3 py-2">
            <p className="text-xs text-sidebar-foreground/80">
              Recommendation + HITL only
            </p>
            <p className="text-xs text-sidebar-foreground/60">
              No source-system writeback
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              navigate({ to: "/login" });
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out ({session.email})
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Mayo POC</span>
            <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
              Test
            </span>
            <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
              1-2 months
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-input bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Play className="h-3.5 w-3.5" />
            Guided tour
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 py-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Mayo Phase 1 lifecycle
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A configurable, evidence-led AR intelligence workflow with governed
            human validation.
          </p>

          {/* Stat cards */}
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

          {/* Lifecycle */}
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

          {/* Policy banner */}
          <div className="mt-5 rounded-r-md border-l-4 border-l-amber-500 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Ground-truth policy:</span> paid
              accounts provide positive path evidence. Historical write-offs,
              returns and adjustments remain context until Operations
              adjudicates them.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
