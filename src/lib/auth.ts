const SESSION_KEY = "rm-agentic-ai-session";

export interface DummySession {
  name: string;
  email: string;
  signedInAt: string;
}

export function getSession(): DummySession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DummySession;
  } catch {
    return null;
  }
}

export function signInWithMicrosoft(): DummySession {
  const session: DummySession = {
    name: "Mayo Operator",
    email: "operator@mayo.example.com",
    signedInAt: new Date().toISOString(),
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  window.localStorage.removeItem(SESSION_KEY);
}
