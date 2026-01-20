import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { IngredientsList } from "./ingredients-list";
import { mockIngredients } from "@/fixtures/ingredients";
import { useRecipe } from "@/hooks/use-recipe";
import type { Recipe } from "@/types/recipe";
import { makeRecipeStore } from "@/test/mock-recipe-store";

vi.mock("@/hooks/use-recipe", () => ({
  useRecipe: vi.fn(),
}));

const useRecipeMock = vi.mocked(useRecipe);

describe("IngredientsList", () => {
  beforeEach(() => {
    useRecipeMock.mockReset();
  });
  it("renders grouped ingredient categories", () => {
    useRecipeMock.mockReturnValue({
      ...makeRecipeStore({
        recipe: { ingredients: mockIngredients } as Recipe,
      }),
    });
    render(<IngredientsList />);

    expect(screen.getByText("Pantry")).toBeInTheDocument();
    expect(screen.getByText("Dairy")).toBeInTheDocument();
    expect(screen.getByText("Protein")).toBeInTheDocument();
  });

  it("renders ingredient names and quantities", () => {
    useRecipeMock.mockReturnValue({
      ...makeRecipeStore({
        recipe: { ingredients: mockIngredients } as Recipe,
      }),
    });
    render(<IngredientsList />);

    expect(screen.getByText("flour")).toBeInTheDocument();
    expect(screen.getByText("sugar")).toBeInTheDocument();
    expect(screen.getByText("2 cups")).toBeInTheDocument();
    expect(screen.getByText("1 cup")).toBeInTheDocument();
  });
});
