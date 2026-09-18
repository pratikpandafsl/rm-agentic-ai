import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mapping-quality")({
  head: () => ({
    meta: [
      { title: "Mapping & Quality · RM Agentic AI — Mayo Phase 1" },
      {
        name: "description",
        content:
          "Map to canonical fields, profile quality and approve only eligible datasets.",
      },
      {
        property: "og:title",
        content: "Mapping & Quality · RM Agentic AI — Mayo Phase 1",
      },
      {
        property: "og:description",
        content:
          "Map to canonical fields, profile quality and approve only eligible datasets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MappingQualityPage,
});

type Mapping = {
  source: string;
  sourceField: string;
  canonicalField: string;
  status: "Mapped" | "Review";
};

const MAPPINGS: Mapping[] = [
  { source: "Inventory", sourceField: "Acct No", canonicalField: "account_id", status: "Mapped" },
  { source: "835", sourceField: "CLP07", canonicalField: "payer_claim_control_number", status: "Mapped" },
  { source: "835", sourceField: "Check Date", canonicalField: "payment_date", status: "Mapped" },
  { source: "Notes", sourceField: "Activity Date", canonicalField: "note_date", status: "Review" },
];

const STATUS_STYLES: Record<Mapping["status"], string> = {
  Mapped: "bg-green-50 text-green-700",
  Review: "bg-amber-50 text-amber-700",
};

function MappingQualityPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
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

  return (
    <AppLayout active="Mapping & Quality">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Mapping and data quality
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Map to canonical fields, profile quality and approve only eligible
            datasets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => flash("Validation complete. 17 exceptions found.")}
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

      {notice && (
        <p className="mt-3 text-sm font-medium text-green-700">{notice}</p>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Completeness
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">93%</p>
          <p className="mt-1 text-sm text-muted-foreground">Required fields</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Cross-source match
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">86%</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Account, claim and line
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Exceptions
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">17</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Downloadable rows
          </p>
        </div>
      </div>

      <section className="mt-5 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold text-foreground">
          Canonical field mapping
        </h2>
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
            {MAPPINGS.map((m) => (
              <tr
                key={`${m.source}-${m.sourceField}`}
                className="border-t border-border"
              >
                <td className="px-5 py-3 text-foreground">{m.source}</td>
                <td className="px-5 py-3 text-foreground">{m.sourceField}</td>
                <td className="px-5 py-3 text-foreground">
                  {m.canonicalField}
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[11px] font-semibold",
                      STATUS_STYLES[m.status],
                    )}
                  >
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3">
        <p className="text-sm text-amber-800">
          Critical unmapped identifiers, privacy violations or invalid
          date/amount structures block processing.
        </p>
      </div>
    </AppLayout>
  );
}
