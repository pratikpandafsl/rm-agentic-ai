import { useTour } from "@/lib/tour-context";
import { Button } from "@/components/ui/button";

export function TourOverlay() {
  const { active, step, index, steps, next, prev, stop } = useTour();
  if (!active || !step) return null;

  const isLast = index === steps.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Guided tour"
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-6 backdrop-blur-[1px]"
      onKeyDown={(event) => {
        if (event.key === "Escape") stop();
      }}
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-5 shadow-xl">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Guided tour · Step {index + 1} of {steps.length}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">{step.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button variant="outline" onClick={prev} disabled={index === 0}>
            Prev
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={stop}>
              Stop
            </Button>
            <Button autoFocus onClick={next}>
              {isLast ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
