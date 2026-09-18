import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/app-context";
import { useProtectedPage } from "@/lib/use-protected-page";

export const Route = createFileRoute("/account-results")({
  head: () => ({
    meta: [
      { title: "Account Results · RM Agentic AI" },
      { name: "description", content: "Review account outcomes with traceable state, cause, action, confidence and evidence." },
      { property: "og:title", content: "Account Results · RM Agentic AI" },
      { property: "og:description", content: "Review account outcomes with traceable state, cause, action, confidence and evidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountResultsRoute,
});

function AccountResultsRoute() {
  const ready = useProtectedPage("Account Results");
  if (!ready) return null;
  return <AccountResultsPage />;
}

function AccountResultsPage() {
  const { tenant } = useApp();

  return (
    <AppLayout active="Account Results">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Account results</h1>
        <p className="mt-1 text-sm text-muted-foreground">One account per row with a traceable history, state, cause, action, confidence and evidence.</p>
      </div>

      <section className="mt-4 overflow-x-auto rounded-lg border border-border bg-card p-3 shadow-sm">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <thead className="bg-muted/70 text-[10px] uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-semibold">Account</th>
              <th className="px-3 py-2 font-semibold">Current state</th>
              <th className="px-3 py-2 font-semibold">Root cause</th>
              <th className="px-3 py-2 font-semibold">Action</th>
              <th className="px-3 py-2 font-semibold">Confidence</th>
              <th className="px-3 py-2 font-semibold">Evidence</th>
              <th className="px-3 py-2 font-semibold">Review</th>
            </tr>
          </thead>
          <tbody>
            {tenant.accountResults.map((result) => (
              <tr key={result.account} className="border-t border-border text-sm text-foreground">
                <td className="whitespace-nowrap px-3 py-3 font-semibold text-primary">{result.account}</td>
                <td className="whitespace-nowrap px-3 py-3">{result.state}</td>
                <td className="px-3 py-3">{result.cause}</td>
                <td className="whitespace-nowrap px-3 py-3 font-semibold">{result.action}</td>
                <td className="whitespace-nowrap px-3 py-3">{result.confidence}</td>
                <td className="px-3 py-3">{result.evidence}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  <span className={result.review === "Validated" ? "rounded bg-status-success px-2 py-1 text-[10px] font-semibold text-status-success-foreground" : "rounded bg-status-warning px-2 py-1 text-[10px] font-semibold text-status-warning-foreground"}>{result.review}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
}
