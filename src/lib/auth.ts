import { useUserStore, type UserInfo } from "@/stores/use-user-store";

const SESSION_KEY = "rm-agentic-ai-session";

export interface DummySession {
  name: string;
  email: string;
  signedInAt: string;
}

export function getSession(): DummySession | null {
  if (typeof window === "undefined") return null;
  // Prefer the zustand store; fall back to the legacy session key.
  const stored = useUserStore.getState().user;
  if (stored) return stored;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DummySession;
  } catch {
    return null;
  }
}

export function signInWithMicrosoft(): DummySession {
  const session: UserInfo = {
    name: "Mayo Operator",
    email: "operator@mayo.example.com",
    signedInAt: new Date().toISOString(),
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  useUserStore.getState().setUser(session);
  return session;
}

export function signOut() {
  window.localStorage.removeItem(SESSION_KEY);
  useUserStore.getState().signOut();
}
