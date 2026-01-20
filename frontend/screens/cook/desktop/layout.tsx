"use client";

import { ChevronRight } from "lucide-react";
import { CopilotChat } from "@copilotkit/react-ui";
import { Button } from "@/components/generated/button";
import { UploadScreen } from "@/screens/upload-screen/upload-screen";
import { IngredientsPanel } from "./ingredients-panel";
import { RecipeHeader } from "../components/recipe-header";
import { StepCard } from "../components/step-card";
import { useRecipe } from "@/hooks/use-recipe";

export function DesktopLayout() {
  const {
    recipe,
    currentStep,
    totalSteps,
    isComplete,
    threadId,
    onNextStep,
    onFileSelect,
    isUploading,
    error,
  } = useRecipe();

  if (!recipe) {
    return (
      <UploadScreen
        onFileSelect={onFileSelect}
        isUploading={isUploading}
        error={error}
      />
    );
  }

  return (
    <div className="grid h-screen grid-cols-[320px_minmax(0,1fr)_360px] bg-background">
      <IngredientsPanel />

      <div className="flex h-full flex-col">
        <RecipeHeader recipe={recipe} variant="desktop" />

        <div className="flex-1 overflow-hidden">
          <CopilotChat
            key={threadId ?? "no-thread"}
            className="h-full"
            labels={{
              initial: `Ask me anything about "${recipe.title}"`,
            }}
          />
        </div>
      </div>

      <aside className="flex h-full flex-col border-l border-border bg-background">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-lg font-semibold">Steps</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {totalSteps} steps
          </p>
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
          <Button
            onClick={onNextStep}
            disabled={isComplete}
            className="w-full"
          >
            {isComplete ? "Finished" : "Next"}
            {!isComplete && <ChevronRight className="ml-1 h-5 w-5" />}
          </Button>
        </div>
      </aside>
    </div>
  );
}
