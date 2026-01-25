"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/generated/button";
import { StepCard } from "../components/step-card";
import { useRecipe } from "@/hooks/use-recipe";

export function StepsPanel() {
  const { recipe, currentStep, totalSteps, isComplete, moveToNextStep } = useRecipe();

  if (!recipe) return null;

  return (
    <aside className="flex h-screen flex-col border-l border-border bg-background sticky top-0">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-lg font-semibold">Steps</h2>
        <p className="text-sm text-muted-foreground mt-1">{totalSteps} steps</p>
      </div>
      <div className="flex-1 overflow-auto px-6 py-6 space-y-3">
        {recipe.steps.map((step) => (
          <StepCard
            key={step.step_number}
            step={step}
            isActive={currentStep === step.step_number}
            isComplete={currentStep > step.step_number}
          />
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <Button onClick={moveToNextStep} disabled={isComplete} className="w-full">
          {isComplete ? "Finished" : "Next"}
          {!isComplete && <ChevronRight className="ml-1 h-5 w-5" />}
        </Button>
      </div>
    </aside>
  );
}
