"use client";

import { useState } from "react";
import { Clock, Flame, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecipeStep } from "@/types/recipe";

interface StepCardProps {
  step: RecipeStep;
  isActive: boolean;
  isComplete: boolean;
}

export function StepCard({ step, isActive, isComplete }: StepCardProps) {
  const [showTips, setShowTips] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4 transition-all duration-300 ease-out",
        isActive && "border-accent bg-accent/5 scale-[1.02]",
        isComplete && "border-border bg-muted/30 opacity-60",
        !isActive && !isComplete && "border-border"
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 transition-colors duration-300",
            isActive && "bg-accent text-white",
            isComplete && "bg-foreground text-background",
            !isActive && !isComplete && "bg-muted text-muted-foreground"
          )}
        >
          {step.step_number}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm leading-relaxed transition-colors duration-300",
              isActive && "text-foreground font-medium",
              isComplete && "text-muted-foreground"
            )}
          >
            {step.instruction}
          </p>

          {(step.duration_minutes || step.requires_attention) && (
            <div className="flex items-center gap-3 mt-2">
              {step.duration_minutes && (
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    isActive ? "text-accent" : "text-muted-foreground"
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {step.duration_minutes} min
                </span>
              )}
              {step.requires_attention && (
                <span className="flex items-center gap-1 text-xs text-warning">
                  <Flame className="h-3.5 w-3.5" />
                  Watch closely
                </span>
              )}
            </div>
          )}

          {step.tips.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowTips(!showTips)}
                className={cn(
                  "flex items-center gap-1 text-xs transition-colors",
                  isActive
                    ? "text-accent hover:text-accent/80"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Lightbulb className="h-3.5 w-3.5" />
                {step.tips.length} tip{step.tips.length > 1 ? "s" : ""}
              </button>

              {showTips && (
                <ul className="mt-2 space-y-1 pl-5 text-xs text-muted-foreground">
                  {step.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
