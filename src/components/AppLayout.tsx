import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
import { getSession, signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { label: string; icon: LucideIcon; to?: string }[] = [
  { label: "Overview", icon: LayoutGrid, to: "/" },
  { label: "Project Setup", icon: Briefcase, to: "/project-setup" },
  { label: "Rules", icon: Scale, to: "/rules" },
  { label: "Data Sources", icon: Database, to: "/data-sources" },
  { label: "Mapping & Quality", icon: ShieldCheck, to: "/mapping-quality" },
  { label: "Agent Configuration", icon: SlidersHorizontal, to: "/agent-configuration" },
  { label: "Workflow Designer", icon: Workflow, to: "/workflow-designer" },
  { label: "POC Runs", icon: Target, to: "/poc-runs" },
  { label: "Account Results", icon: Newspaper, to: "/account-results" },
  { label: "New Patterns", icon: Sparkles, to: "/new-patterns" },
  { label: "Output File", icon: FileText, to: "/output-file" },
  { label: "HITL", icon: User, to: "/hitl" },
  { label: "Validation", icon: TrendingUp, to: "/validation" },
  { label: "Audit & Versions", icon: History, to: "/audit-versions" },
];

export function AppLayout({
  children,
  active,
}: {
  children: ReactNode;
  active: string;
}) {
  const navigate = useNavigate();
  const session = getSession();

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
                {item.to ? (
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active === item.label
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </a>
                )}
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
          {session && (
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
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
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

        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
