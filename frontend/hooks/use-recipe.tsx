"use client";

import { useCallback } from "react";
import { useCoAgent, useCopilotChat } from "@copilotkit/react-core";
import type { Recipe, RecipeContext } from "@/types/recipe";
import { scaleRecipe } from "@/lib/scale-recipe";

export interface RecipeStore {
  recipeContext: RecipeContext | undefined;
  setRecipeContext: (
    newState:
      | RecipeContext
      | ((prevState: RecipeContext | undefined) => RecipeContext),
  ) => void;
  threadId: string | undefined;
  recipe: Recipe | null;
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  moveToNextStep: () => void;
  scaleServings: (targetServings: number) => void;
}

export function useRecipe(): RecipeStore {
  useCopilotChat();

  const {
    state: recipeContext,
    setState: setRecipeContext,
    threadId,
  } = useCoAgent<RecipeContext>({
    name: "recipe_agent",
  });

  const recipe = recipeContext?.recipe ?? null;
  const totalSteps = recipe?.steps.length ?? 0;
  const currentStep = recipeContext?.current_step ?? 1;
  const isComplete = recipe ? currentStep > totalSteps : false;

  const moveToNextStep = useCallback(() => {
    if (!recipeContext?.recipe || isComplete) {
      return;
    }
    setRecipeContext({ ...recipeContext, current_step: currentStep + 1 });
  }, [recipeContext, isComplete, setRecipeContext, currentStep]);

  const scaleServings = useCallback(
    (targetServings: number) => {
      if (!recipeContext?.recipe) {
        return;
      }

      const nextServings = Math.max(1, Math.floor(targetServings));
      if (nextServings === recipeContext.recipe.servings) {
        return;
      }

      setRecipeContext({
        ...recipeContext,
        recipe: scaleRecipe(recipeContext.recipe, nextServings),
        scaled_servings: nextServings,
      });
    },
    [recipeContext, setRecipeContext],
  );

  return {
    recipeContext,
    setRecipeContext,
    threadId,
    recipe,
    currentStep,
    totalSteps,
    isComplete,
    moveToNextStep,
    scaleServings,
  };
}
