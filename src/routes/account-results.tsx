import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/account-results")({
  head: () => ({
    meta: [
      { title: "Account Results · RM Agentic AI — Mayo Phase 1" },
      { name: "description", content: "Review Mayo account outcomes with traceable state, cause, action, confidence and evidence." },
      { property: "og:title", content: "Account Results · RM Agentic AI — Mayo Phase 1" },
      { property: "og:description", content: "Review Mayo account outcomes with traceable state, cause, action, confidence and evidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountResultsRoute,
});

const RESULTS = [
  { account: "MAYO-000184", state: "Denied, unpaid", cause: "Missing modifier after coding denial", action: "Correct and rebill", confidence: "91%", evidence: "DOS; bill date; CARC/RARC; CPT; modifier; note", review: "Validated" },
  { account: "MAYO-000207", state: "Paid short", cause: "Expected reimbursement variance", action: "Underpayment dispute", confidence: "74%", evidence: "835 lines; payment; expected reimbursement", review: "Needs review" },
  { account: "MAYO-000233", state: "Resubmitted, pending", cause: "No final adjudication", action: "Re-status", confidence: "69%", evidence: "Resubmission date; payer; account age; notes", review: "Needs review" },
  { account: "MAYO-000261", state: "Denied", cause: "Medical necessity denial", action: "Appeal", confidence: "88%", evidence: "CARC/RARC; ICD-10; CPT; auth; notes", review: "Validated" },
];

function AccountResultsRoute() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getSession()) navigate({ to: "/login" });
    setChecked(true);
  }, [navigate]);

  if (!checked) return null;
  return <AccountResultsPage />;
}

function AccountResultsPage() {
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
            {RESULTS.map((result) => (
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