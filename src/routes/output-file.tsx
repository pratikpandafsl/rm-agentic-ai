import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { useProtectedPage } from "@/lib/use-protected-page";
import type { TenantData } from "@/data/tenants";

export const Route = createFileRoute("/output-file")({
  head: () => ({
    meta: [
      { title: "Classification Output · RM Agentic AI" },
      { name: "description", content: "Generate and export the Operations-required one-row-per-account validation file." },
      { property: "og:title", content: "Classification Output · RM Agentic AI" },
      { property: "og:description", content: "Generate and export the Operations-required one-row-per-account validation file." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OutputFileRoute,
});

function OutputFileRoute() {
  const ready = useProtectedPage("Output File");
  if (!ready) return null;
  return <OutputFilePage />;
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function exportCsv(output: TenantData["outputFile"]) {
  const headers = ["Account", "History", "State", "Root cause", "Action", "Confidence", "Fields relied on"];
  const rows = output.rows.map((row) => [row.account, row.history, row.state, row.cause, row.action, row.confidence, row.fields]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = output.fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function OutputFilePage() {
  const { tenant } = useApp();
  const output = tenant.outputFile;

  return (
    <AppLayout active="Output File">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Classification output</h1>
          <p className="mt-1 text-sm text-muted-foreground">Generate the Operations-required one-row-per-account validation file.</p>
        </div>
        <Button onClick={() => exportCsv(output)}><Download />Export CSV</Button>
      </div>

      <section className="mt-4 overflow-x-auto rounded-lg border border-border bg-card p-3 shadow-sm">
        <table className="w-full min-w-[1060px] table-fixed border-collapse text-left">
          <thead className="bg-muted/70 text-[10px] uppercase text-muted-foreground">
            <tr>
              <th className="w-[9%] px-3 py-2 font-semibold">Account</th>
              <th className="w-[20%] px-3 py-2 font-semibold">History</th>
              <th className="w-[9%] px-3 py-2 font-semibold">State</th>
              <th className="w-[20%] px-3 py-2 font-semibold">Root cause</th>
              <th className="w-[14%] px-3 py-2 font-semibold">Action</th>
              <th className="w-[7%] px-3 py-2 font-semibold">Confidence</th>
              <th className="w-[21%] px-3 py-2 font-semibold">Fields relied on</th>
            </tr>
          </thead>
          <tbody>
            {output.rows.map((row) => (
              <tr key={row.account} className="border-t border-border align-top text-sm text-foreground">
                <td className="break-words px-3 py-3 font-medium">{row.account}</td>
                <td className="px-3 py-3">{row.history}</td>
                <td className="px-3 py-3">{row.state}</td>
                <td className="px-3 py-3">{row.cause}</td>
                <td className="px-3 py-3">{row.action}</td>
                <td className="px-3 py-3">{row.confidence}</td>
                <td className="px-3 py-3">{row.fields}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
}
