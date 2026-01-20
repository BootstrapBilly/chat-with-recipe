import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { IngredientsPanel } from "./ingredients-panel";
import { mockIngredients } from "@/fixtures/ingredients";
import { useRecipe } from "@/hooks/use-recipe";
import type { Recipe } from "@/types/recipe";
import { makeRecipeStore } from "@/test/mock-recipe-store";

vi.mock("@/hooks/use-recipe", () => ({
  useRecipe: vi.fn(),
}));

const useRecipeMock = vi.mocked(useRecipe);

describe("IngredientsPanel", () => {
  beforeEach(() => {
    useRecipeMock.mockReset();
  });

  it("renders header, count, and list items", () => {
    useRecipeMock.mockReturnValue({
      ...makeRecipeStore({
        recipe: { ingredients: mockIngredients, servings: 4 } as Recipe,
      }),
    });

    render(<IngredientsPanel />);

    expect(screen.getByText("Ingredients")).toBeInTheDocument();
    expect(screen.getByText("4 items")).toBeInTheDocument();
    expect(screen.getByText("flour")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
  });
});
