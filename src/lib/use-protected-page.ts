import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getSession } from "@/lib/auth";
import { useApp } from "@/lib/app-context";

/**
 * Guards a page: requires a session and, when a menu item is given,
 * requires the simulated role to have access to it.
 */
export function useProtectedPage(menuItem?: string) {
  const navigate = useNavigate();
  const { canAccess } = useApp();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      navigate({ to: "/login" });
      return;
    }
    if (menuItem && !canAccess(menuItem)) {
      navigate({ to: "/" });
      return;
    }
    setReady(true);
  }, [navigate, menuItem, canAccess]);

  return ready;
}
