import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecipeProvider, useRecipe } from "./use-recipe";
import { recipeWithSteps } from "@/fixtures/recipe";
import type { RecipeContext } from "@/types/recipe";

const mutate = vi.fn();

vi.mock("@/hooks/use-upload-recipe", () => ({
  useUploadRecipe: () => ({
    mutate,
    isPending: false,
    error: null,
  }),
}));

function RecipeProbe() {
  const { recipe, currentStep, onFileSelect, onNextStep } = useRecipe();
  return (
    <div>
      <div data-testid="recipe-title">{recipe?.title ?? "none"}</div>
      <div data-testid="current-step">{currentStep}</div>
      <button onClick={() => onFileSelect(new File(["x"], "recipe.txt"))}>
        upload
      </button>
      <button onClick={onNextStep}>next</button>
    </div>
  );
}

describe("useRecipe", () => {
  beforeEach(() => {
    mutate.mockReset();
  });

  it("throws if used without provider", () => {
    const renderWithoutProvider = () => render(<RecipeProbe />);

    expect(renderWithoutProvider).toThrow(
      "useRecipe must be used within RecipeProvider",
    );
  });

  it("updates recipe after upload and advances steps", async () => {
    const user = userEvent.setup();
    const state: RecipeContext = {
      document_text: null,
      recipe: recipeWithSteps,
      current_step: 0,
      scaled_servings: null,
      checked_ingredients: [],
      cooking_started: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutate.mockImplementation((_file: File, options?: any) => {
      options?.onSuccess?.({
        threadId: "thread-1",
        runId: "run-1",
        state,
      });
    });

    render(
      <RecipeProvider>
        <RecipeProbe />
      </RecipeProvider>,
    );

    expect(screen.getByTestId("recipe-title")).toHaveTextContent("none");

    await user.click(screen.getByRole("button", { name: /upload/i }));

    expect(screen.getByTestId("recipe-title")).toHaveTextContent("Pancakes");
    expect(screen.getByTestId("current-step")).toHaveTextContent("0");

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByTestId("current-step")).toHaveTextContent("1");
  });
});
