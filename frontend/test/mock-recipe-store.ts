import { vi } from "vitest";
import type { useRecipe } from "@/hooks/use-recipe";

export function makeRecipeStore(
  overrides: Partial<ReturnType<typeof useRecipe>> = {},
): ReturnType<typeof useRecipe> {
  return {
    recipeContext: null,
    setRecipeContext: vi.fn(),
    recipe: null,
    currentStep: 0,
    totalSteps: 0,
    isComplete: false,
    threadId: undefined,
    onNextStep: vi.fn(),
    ...overrides,
  };
}
