import { vi } from "vitest";
import type { useRecipe } from "@/hooks/use-recipe";

export function makeRecipeStore(
  overrides: Partial<ReturnType<typeof useRecipe>> = {},
) {
  return {
    recipeContext: null,
    recipe: null,
    currentStep: 0,
    totalSteps: 0,
    isComplete: false,
    threadId: null,
    isUploading: false,
    error: null,
    onFileSelect: vi.fn(),
    onNextStep: vi.fn(),
    ...overrides,
  };
}
