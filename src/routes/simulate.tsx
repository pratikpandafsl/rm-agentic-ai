import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";
import { useApp } from "@/lib/app-context";
import { ROLES, type RoleId } from "@/data/roles";
import { TENANT_LIST, type TenantId } from "@/data/tenants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulate")({
  head: () => ({
    meta: [
      { title: "Simulate Role · RM Agentic AI" },
      { name: "description", content: "Switch the simulated user role and active project to preview role-based access across the workspace." },
      { property: "og:title", content: "Simulate Role · RM Agentic AI" },
      { property: "og:description", content: "Switch the simulated user role and active project to preview role-based access across the workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SimulateRoute,
});

function SimulateRoute() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getSession()) navigate({ to: "/login" });
    setChecked(true);
  }, [navigate]);

  if (!checked) return null;
  return <SimulatePage />;
}

function SimulatePage() {
  const { role, setRoleId, tenantId, setTenantId } = useApp();
  const [notice, setNotice] = useState<string | null>(null);

  const chooseRole = (id: RoleId, name: string) => {
    setRoleId(id);
    setNotice(`Now simulating ${name}. The menu reflects this role.`);
  };

  return (
    <AppLayout active="Simulate">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Simulate user</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the role and project to preview. Menu items and page access follow the selected role.
        </p>
      </div>

      {notice && (
        <p role="status" className="mt-3 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground">
          {notice}
        </p>
      )}

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        {ROLES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => chooseRole(item.id, item.name)}
            className={cn(
              "rounded-lg border bg-card p-4 text-left shadow-sm transition-colors",
              role.id === item.id ? "border-primary bg-accent" : "border-border hover:bg-muted/60",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                Role {item.id} · {item.name}
              </p>
              {role.id === item.id && (
                <span className="rounded bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">
                  Active
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.menu.map((menuItem) => (
                <span key={menuItem} className="rounded bg-muted px-2 py-1 text-[10px] text-foreground">
                  {menuItem}
                </span>
              ))}
            </div>
          </button>
        ))}
      </section>

      <section className="mt-5 rounded-lg border border-border bg-card p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Active project</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          The same switch is available in the top bar. All screen data follows this selection.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TENANT_LIST.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTenantId(item.id as TenantId)}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
                tenantId === item.id
                  ? "border-primary bg-accent text-foreground"
                  : "border-input bg-card text-foreground hover:bg-muted/60",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
