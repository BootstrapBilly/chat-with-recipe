"use client";

import { MessageCircle, ChevronRight, Users, ListChecks } from "lucide-react";
import { CopilotChat } from "@copilotkit/react-ui";
import { Button } from "@/components/generated/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/generated/sheet";
import { Header } from "./header";
import { StepCard } from "./step-card";
import type { Recipe } from "@/types/recipe";

interface MobileLayoutProps {
  recipe: Recipe;
  currentStep: number;
  threadId: string | null;
  onNextStep: () => void;
}

export function MobileLayout({
  recipe,
  currentStep,
  threadId,
  onNextStep,
}: MobileLayoutProps) {
  const totalSteps = recipe.steps.length;
  const isComplete = currentStep >= totalSteps;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        recipe={recipe}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

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
          <Button variant="outline" className="h-12 px-3 gap-1.5">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">{recipe.servings}</span>
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12">
            <ListChecks className="h-5 w-5" />
            <span className="sr-only">Ingredients</span>
          </Button>
        </div>
        <Button
          onClick={onNextStep}
          disabled={isComplete}
          className="h-12 px-8"
        >
          {isComplete ? "Done" : currentStep === 0 ? "Start" : "Next"}
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
