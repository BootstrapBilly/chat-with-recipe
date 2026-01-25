import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DesktopLayout } from "./layout";
import { baseRecipe } from "@/fixtures/recipe";
import { useRecipe } from "@/hooks/use-recipe";
import type { RecipeContext } from "@/types/recipe";

vi.mock("@copilotkit/react-ui", () => ({
  CopilotChat: () => <div data-testid="copilot-chat">Chat</div>,
}));

vi.mock("@/hooks/use-recipe", () => ({
  useRecipe: vi.fn(),
}));

vi.mock("@/hooks/use-upload-recipe", () => ({
  useUploadRecipe: () => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

const useRecipeMock = vi.mocked(useRecipe);

function mockRecipeContext(recipe: RecipeContext["recipe"]) {
  useRecipeMock.mockReturnValue({
    recipeContext: recipe ? {
      document_text: null,
      recipe,
      current_step: 1,
      scaled_servings: null,
      checked_ingredients: [],
      cooking_started: false,
    } : undefined,
    setRecipeContext: vi.fn(),
    threadId: "thread-1",
    recipe,
    currentStep: 1,
    totalSteps: recipe?.steps?.length ?? 0,
    isComplete: false,
    moveToNextStep: vi.fn(),
  } as unknown as ReturnType<typeof useRecipe>);
}

describe("DesktopLayout", () => {
  beforeEach(() => {
    useRecipeMock.mockReset();
  });

  it("renders upload screen when no recipe", () => {
    mockRecipeContext(null);
    render(<DesktopLayout />);

    expect(
      screen.getByText("Upload a recipe to get started"),
    ).toBeInTheDocument();
  });

  it("renders ingredients, chat, and steps when recipe is present", () => {
    mockRecipeContext(baseRecipe);
    render(<DesktopLayout />);

    expect(screen.getByText("Ingredients")).toBeInTheDocument();
    expect(screen.getByTestId("copilot-chat")).toBeInTheDocument();
    expect(screen.getByText("Steps")).toBeInTheDocument();
  });
});
