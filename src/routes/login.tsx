import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signInWithMicrosoft } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · RM Agentic AI" },
      {
        name: "description",
        content:
          "Sign in with your Microsoft account to access the RM Agentic AI accounts-receivable intelligence workspace.",
      },
      { property: "og:title", content: "Sign in · RM Agentic AI" },
      {
        property: "og:description",
        content:
          "Sign in with your Microsoft account to access the RM Agentic AI accounts-receivable intelligence workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function MicrosoftLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 21 21" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f35325" />
      <rect x="11" y="1" width="9" height="9" fill="#81bc06" />
      <rect x="1" y="11" width="9" height="9" fill="#05a6f0" />
      <rect x="11" y="11" width="9" height="9" fill="#ffba08" />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    // Simulate the SSO round-trip
    window.setTimeout(() => {
      signInWithMicrosoft();
      navigate({ to: "/" });
    }, 900);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/60 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              AI
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">RM Agentic AI</p>
              <p className="text-xs text-muted-foreground">AR intelligence workspace</p>
            </div>
          </div>

          <h1 className="mt-8 text-xl font-semibold text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use your organization account to continue to the AR intelligence workspace.
          </p>

          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <MicrosoftLogo />
            )}
            {loading ? "Redirecting to Microsoft…" : "Sign in with Microsoft"}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo environment — SSO is simulated, no credentials are requested.
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Protected by single sign-on
        </p>
      </div>
    </div>
  );
}
