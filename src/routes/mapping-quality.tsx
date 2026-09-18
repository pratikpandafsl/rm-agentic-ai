import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { useProtectedPage } from "@/lib/use-protected-page";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mapping-quality")({
  head: () => ({
    meta: [
      { title: "Mapping & Quality · RM Agentic AI" },
      { name: "description", content: "Map to canonical fields, profile quality and approve only eligible datasets." },
      { property: "og:title", content: "Mapping & Quality · RM Agentic AI" },
      { property: "og:description", content: "Map to canonical fields, profile quality and approve only eligible datasets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MappingQualityRoute,
});

const STATUS_STYLES: Record<string, string> = {
  Mapped: "bg-green-50 text-green-700",
  Review: "bg-amber-50 text-amber-700",
};

function MappingQualityRoute() {
  const ready = useProtectedPage("Mapping & Quality");
  if (!ready) return null;
  return <MappingQualityPage />;
}

function MappingQualityPage() {
  const { tenant } = useApp();
  const data = tenant.mappingQuality;
  const [notice, setNotice] = useState<string | null>(null);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  };

  return (
    <AppLayout active="Mapping & Quality">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mapping and data quality</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Map to canonical fields, profile quality and approve only eligible datasets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => flash(data.validateResult)}
            className="rounded-md border border-input bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Validate
          </button>
          <button
            type="button"
            onClick={() => flash("Datasets approved for test.")}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Approve for test
          </button>
        </div>
      </div>

      {notice && <p className="mt-3 text-sm font-medium text-green-700">{notice}</p>}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {data.metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{metric.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{metric.detail}</p>
          </div>
        ))}
      </div>

      <section className="mt-5 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold text-foreground">Canonical field mapping</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-2.5">Source</th>
              <th className="px-5 py-2.5">Source field</th>
              <th className="px-5 py-2.5">Canonical field</th>
              <th className="px-5 py-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.mappings.map((m) => (
              <tr key={`${m.source}-${m.sourceField}`} className="border-t border-border">
                <td className="px-5 py-3 text-foreground">{m.source}</td>
                <td className="px-5 py-3 text-foreground">{m.sourceField}</td>
                <td className="px-5 py-3 text-foreground">{m.canonicalField}</td>
                <td className="px-5 py-3 text-right">
                  <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-semibold", STATUS_STYLES[m.status])}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3">
        <p className="text-sm text-amber-800">{data.warning}</p>
      </div>
    </AppLayout>
  );
}
