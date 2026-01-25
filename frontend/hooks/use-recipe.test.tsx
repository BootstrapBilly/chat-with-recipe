import { useState } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecipeProvider, useRecipe } from "./use-recipe";
import { recipeWithSteps } from "@/fixtures/recipe";
import type { RecipeContext } from "@/types/recipe";

const sendMessage = vi.fn();

vi.mock("@copilotkit/react-core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@copilotkit/react-core")>();
  return {
    ...actual,
    useCopilotChatInternal: () => ({
      sendMessage,
    }),
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
  const { recipe, currentStep, setRecipeContext, onNextStep } = useRecipe();
  return (
    <div>
      <div data-testid="recipe-title">{recipe?.title ?? "none"}</div>
      <div data-testid="current-step">{currentStep}</div>
      <button
        onClick={() =>
          setRecipeContext({
            document_text: null,
            recipe: recipeWithSteps,
            current_step: 0,
            scaled_servings: null,
            checked_ingredients: [],
            cooking_started: false,
          })
        }
      >
        set recipe
      </button>
      <button onClick={onNextStep}>next</button>
    </div>
  );
}

describe("useRecipe", () => {
  beforeEach(() => {
    sendMessage.mockReset();
  });

  it("throws if used without provider", () => {
    const renderWithoutProvider = () => render(<RecipeProbe />);

    expect(renderWithoutProvider).toThrow(
      "useRecipe must be used within RecipeProvider",
    );
  });

  it("exposes setRecipeContext and sends next step message", async () => {
    const user = userEvent.setup();

    render(
      <RecipeProvider>
        <RecipeProbe />
      </RecipeProvider>,
    );

    expect(screen.getByTestId("recipe-title")).toHaveTextContent("none");

    await user.click(screen.getByRole("button", { name: /set recipe/i }));

    expect(screen.getByTestId("recipe-title")).toHaveTextContent("Pancakes");
    expect(screen.getByTestId("current-step")).toHaveTextContent("1");

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(sendMessage).toHaveBeenCalledTimes(1);
  });
});
