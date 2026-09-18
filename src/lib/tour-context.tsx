import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { TOUR_STEPS, type TourStep } from "@/data/tour";
import { useApp } from "@/lib/app-context";

interface TourContextValue {
  active: boolean;
  index: number;
  steps: TourStep[];
  step: TourStep | null;
  start: () => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { role } = useApp();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  const steps = useMemo(
    () => TOUR_STEPS.filter((step) => role.menu.includes(step.menu)),
    [role],
  );

  const goTo = useCallback(
    (nextIndex: number) => {
      const step = steps[nextIndex];
      if (!step) return;
      setIndex(nextIndex);
      navigate({ to: step.to });
    },
    [navigate, steps],
  );

  const start = useCallback(() => {
    if (steps.length === 0) return;
    setActive(true);
    goTo(0);
  }, [goTo, steps.length]);

  const next = useCallback(() => {
    if (index >= steps.length - 1) {
      setActive(false);
      return;
    }
    goTo(index + 1);
  }, [goTo, index, steps.length]);

  const prev = useCallback(() => {
    if (index > 0) goTo(index - 1);
  }, [goTo, index]);

  const stop = useCallback(() => setActive(false), []);

  const value = useMemo<TourContextValue>(
    () => ({
      active,
      index,
      steps,
      step: active ? (steps[index] ?? null) : null,
      start,
      next,
      prev,
      stop,
    }),
    [active, index, steps, start, next, prev, stop],
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}
