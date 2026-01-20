"use client";

import { ChevronRight } from "lucide-react";
import { CopilotChat } from "@copilotkit/react-ui";
import { Button } from "@/components/generated/button";
import { UploadScreen } from "@/screens/upload-screen/upload-screen";
import { IngredientsPanel } from "./ingredients-panel";
import { RecipeHeader } from "../components/recipe-header";
import { StepCard } from "../components/step-card";
import type { Recipe } from "@/types/recipe";

interface UploadState {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  error: string | null;
}

interface Props {
  recipe: Recipe | null;
  currentStep: number;
  threadId: string | null;
  onNextStep: () => void;
  uploadState: UploadState;
}

export function DesktopLayout({
  recipe,
  currentStep,
  threadId,
  onNextStep,
  uploadState,
}: Props) {
  const totalSteps = recipe?.steps.length ?? 0;
  const isComplete = recipe ? currentStep >= totalSteps : false;

  return (
    <div className="grid h-screen grid-cols-[320px_minmax(0,1fr)_360px] bg-background">
      {recipe ? (
        <IngredientsPanel
          ingredients={recipe.ingredients}
          servings={recipe.servings}
        />
      ) : (
        <aside className="flex h-full flex-col border-r border-border bg-muted/20 px-6 py-5">
          <h2 className="text-lg font-semibold">Ingredients</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a recipe to view ingredients.
          </p>
        </aside>
      )}

      <div className="flex h-full flex-col">
        {recipe ? (
          <RecipeHeader recipe={recipe} variant="desktop" />
        ) : (
          <header className="border-b border-border px-6 py-5">
            <h1 className="text-xl font-semibold">Recipe Assistant</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a recipe to start chatting.
            </p>
          </header>
        )}

        <div className="flex-1 overflow-hidden">
          {recipe ? (
            <CopilotChat
              key={threadId ?? "no-thread"}
              className="h-full"
              labels={{
                initial: `Ask me anything about "${recipe.title}"`,
              }}
            />
          ) : (
            <div className="h-full">
              <UploadScreen
                onFileSelect={uploadState.onFileSelect}
                isUploading={uploadState.isUploading}
                error={uploadState.error}
              />
            </div>
          )}
        </div>
      </div>

      {recipe ? (
        <aside className="flex h-full flex-col border-l border-border bg-background">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="text-lg font-semibold">Steps</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {recipe.steps.length} steps
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
              {isComplete ? "Done" : currentStep === 0 ? "Start" : "Next"}
              {!isComplete && <ChevronRight className="ml-1 h-5 w-5" />}
            </Button>
          </div>
        </aside>
      ) : (
        <aside className="flex h-full flex-col border-l border-border bg-muted/20 px-6 py-5">
          <h2 className="text-lg font-semibold">Steps</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Steps will appear after you upload a recipe.
          </p>
        </aside>
      )}
    </div>
  );
}
