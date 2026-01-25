"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useCoAgent, useCopilotChat } from "@copilotkit/react-core";
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
  useCopilotChat(); // This has a sideeffect to connect the agent to the backend

  const {
    state: recipeContext,
    setState: setRecipeContext,
    threadId,
  } = useCoAgent<RecipeContext>({
    name: "recipe_agent",
  }); // this is what we use for 2 way binding state, but it doesn't connect itself?? That's why we have the hook above, to init the connection

  const recipe = recipeContext?.recipe ?? null;
  const totalSteps = recipe?.steps.length ?? 0;
  const currentStep = recipeContext?.current_step;
  const isComplete = recipe ? currentStep >= totalSteps : false;

  const handleNextStep = useCallback(async () => {
    if (!recipeContext?.recipe) return;
    if (!isComplete) {
      setRecipeContext({ ...recipeContext, current_step: currentStep + 1 });
    }
  }, [recipeContext, isComplete, setRecipeContext, currentStep]);

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
