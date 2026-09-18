import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type DragEvent } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { useProtectedPage } from "@/lib/use-protected-page";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/data-sources")({
  head: () => ({
    meta: [
      { title: "Data Sources · RM Agentic AI" },
      { name: "description", content: "Register the approved extracts with period, checksum, classification and lineage." },
      { property: "og:title", content: "Data Sources · RM Agentic AI" },
      { property: "og:description", content: "Register the approved extracts with period, checksum, classification and lineage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DataSourcesRoute,
});

const STATUS_STYLES: Record<string, string> = {
  Ready: "bg-green-50 text-green-700",
  "Access check": "bg-amber-50 text-amber-700",
  Pending: "bg-amber-50 text-amber-700",
};

function DataSourcesRoute() {
  const ready = useProtectedPage("Data Sources");
  if (!ready) return null;
  return <DataSourcesPage />;
}

function DataSourcesPage() {
  const { tenant } = useApp();
  const sources = tenant.dataSources.items;
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    flash(`${files.length} file(s) received for intake review.`);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <AppLayout active="Data Sources">
      <h1 className="text-2xl font-semibold text-foreground">Data sources</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Register the {sources.length} approved {tenant.shortName} extracts with period, checksum, classification and lineage.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sources.map((source) => (
          <div key={source.name} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-semibold text-foreground">{source.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{source.system}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-semibold", STATUS_STYLES[source.status])}>
                {source.status}
              </span>
              {source.rows && <span className="text-xs text-muted-foreground">{source.rows}</span>}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-border bg-card shadow-sm">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold text-foreground">
          File-based POC intake
        </h2>
        <div className="p-5">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-input px-6 py-10 text-center transition-colors",
              dragging ? "bg-accent" : "hover:bg-accent/50",
            )}
          >
            <span className="text-sm font-semibold text-foreground">Drop or browse approved masked files</span>
            <span className="mt-1.5 text-xs text-muted-foreground">
              CSV, XLSX or JSON. Direct identifiers must not enter model requests.
            </span>
            {notice && <span className="mt-3 text-xs font-medium text-green-700">{notice}</span>}
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept=".csv,.xlsx,.json"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </section>
    </AppLayout>
  );
}
