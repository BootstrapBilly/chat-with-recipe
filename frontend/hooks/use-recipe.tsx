"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useCoAgent, useCopilotChatInternal } from "@copilotkit/react-core";
import { randomUUID } from "@copilotkit/shared";
import type { Recipe, RecipeContext } from "@/types/recipe";

interface RecipeStore {
  recipeContext: RecipeContext | null;
  setRecipeContext: (state: RecipeContext) => void;
  recipe: Recipe | null;
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  threadId: string | undefined;
  onNextStep: () => void;
}

const RecipeContextValue = createContext<RecipeStore | null>(null);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const { sendMessage } = useCopilotChatInternal();

  const {
    state: recipeContext,
    setState: setRecipeContext,
    threadId,
  } = useCoAgent<RecipeContext>({
    name: "recipe_agent",
  });

  const handleNextStep = useCallback(async () => {
    if (!recipeContext?.recipe) return;
    await sendMessage({
      id: randomUUID(),
      role: "user",
      content: "Move on to the next step",
    });
  }, [recipeContext, sendMessage]);

  const recipe = recipeContext?.recipe ?? null;
  const totalSteps = recipe?.steps.length ?? 0;
  const currentStep = (recipeContext?.current_step ?? 0) + 1;
  const isComplete = recipe ? currentStep >= totalSteps : false;

  const value = useMemo<RecipeStore>(
    () => ({
      recipeContext,
      setRecipeContext,
      recipe,
      threadId,
      currentStep,
      totalSteps,
      isComplete,
      onNextStep: handleNextStep,
    }),
    [
      recipeContext,
      setRecipeContext,
      recipe,
      threadId,
      currentStep,
      totalSteps,
      isComplete,
      handleNextStep,
    ],
  );

  return (
    <RecipeContextValue.Provider value={value}>
      {children}
    </RecipeContextValue.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContextValue);
  if (!context) {
    throw new Error("useRecipe must be used within RecipeProvider");
  }
  return context;
}
