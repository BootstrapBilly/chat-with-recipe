import { cn } from "@/lib/utils";
import type { RecipeStep } from "@/types/recipe";

interface StepCardProps {
  step: RecipeStep;
  isActive?: boolean;
  isComplete?: boolean;
}

export function StepCard({ step, isActive, isComplete }: StepCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4",
        isActive && "border-accent bg-accent/5",
        isComplete && "border-border bg-muted/30 opacity-60",
        !isActive && !isComplete && "border-border",
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0",
            isActive && "bg-accent text-white",
            isComplete && "bg-foreground text-background",
            !isActive && !isComplete && "bg-muted text-muted-foreground",
          )}
        >
          {step.step_number}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm leading-relaxed",
              isComplete && "text-muted-foreground",
            )}
          >
            {step.instruction}
          </p>
        </div>
      </div>
    </div>
  );
}
