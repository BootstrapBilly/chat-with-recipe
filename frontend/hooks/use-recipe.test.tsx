import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRecipe } from "./use-recipe";
import { recipeWithSteps } from "@/fixtures/recipe";
import type { RecipeContext } from "@/types/recipe";

vi.mock("@copilotkit/react-core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@copilotkit/react-core")>();
  return {
    ...actual,
    useCopilotChat: () => ({}),
    useCoAgent: () => {
      const [state, setState] = useState<RecipeContext | null>(null);
      return {
        state,
        setState,
        threadId: "test-thread",
      };
    },
  };
});

function RecipeProbe() {
  const { recipeContext, setRecipeContext } = useRecipe();
  const recipe = recipeContext?.recipe;
  return (
    <div>
      <div data-testid="recipe-title">{recipe?.title ?? "none"}</div>
      <button
        onClick={() =>
          setRecipeContext({
            document_text: null,
            recipe: recipeWithSteps,
            current_step: 1,
            scaled_servings: null,
            checked_ingredients: [],
            cooking_started: false,
          })
        }
      >
        set recipe
      </button>
    </div>
  );
}

describe("useRecipe", () => {
  it("exposes recipeContext and setRecipeContext from useCoAgent", async () => {
    const user = userEvent.setup();

    render(<RecipeProbe />);

    expect(screen.getByTestId("recipe-title")).toHaveTextContent("none");

    await user.click(screen.getByRole("button", { name: /set recipe/i }));

    expect(screen.getByTestId("recipe-title")).toHaveTextContent("Pancakes");
  });
});
