"use client";

import { MessageCircle, ChevronRight } from "lucide-react";
import { CopilotChat } from "@copilotkit/react-ui";
import { Button } from "@/components/generated/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/generated/sheet";
import { RecipeHeader } from "../components/recipe-header";
import { Ingredients } from "./ingredients";
import { ScaleServings } from "../components/scale-servings";
import { StepCard } from "../components/step-card";
import { UploadScreen } from "@/screens/upload-screen/upload-screen";
import { useRecipe } from "@/hooks/use-recipe";

export function MobileLayout() {
  const { recipe, currentStep, isComplete, threadId, onNextStep } = useRecipe();

  if (!recipe) {
    return <UploadScreen />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <RecipeHeader recipe={recipe} />

      {/* Steps */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 space-y-3">
          {recipe.steps.map((step) => (
            <StepCard
              key={step.step_number}
              step={step}
              isActive={currentStep === step.step_number}
              isComplete={currentStep > step.step_number}
            />
          ))}
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <ScaleServings />
          <Ingredients />
        </div>
        <Button
          onClick={onNextStep}
          disabled={isComplete}
          className="h-12 px-8"
        >
          {isComplete ? "Finished" : "Next"}
          {!isComplete && <ChevronRight className="ml-1 h-5 w-5" />}
        </Button>
      </div>

      {/* Chat FAB */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="fixed bottom-24 right-4 h-12 w-12 rounded-full shadow-lg bg-background"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh] p-0">
          <SheetTitle className="sr-only">Recipe Assistant</SheetTitle>
          <CopilotChat
            key={threadId ?? "no-thread"}
            className="h-full"
            labels={{
              initial: `Ask me anything about "${recipe.title}"`,
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
