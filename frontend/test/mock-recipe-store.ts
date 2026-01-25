import { vi } from "vitest";
import type { RecipeStore } from "@/hooks/use-recipe";

export function makeRecipeStore(overrides: Partial<RecipeStore> = {}): RecipeStore {
  const recipeContext = overrides.recipeContext ?? undefined;
  const recipe = overrides.recipe ?? recipeContext?.recipe ?? null;
  const totalSteps = overrides.totalSteps ?? recipe?.steps?.length ?? 0;
  const currentStep = overrides.currentStep ?? recipeContext?.current_step ?? 1;
  const isComplete = overrides.isComplete ?? (recipe ? currentStep > totalSteps : false);

  return {
    recipeContext,
    setRecipeContext: vi.fn(),
    threadId: undefined,
    recipe,
    currentStep,
    totalSteps,
    isComplete,
    moveToNextStep: vi.fn(),
    ...overrides,
  };
}
