import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { IngredientsList } from "./ingredients-list";
import { mockIngredients } from "@/fixtures/ingredients";
import { useRecipe } from "@/hooks/use-recipe";

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
      recipe: { ingredients: mockIngredients },
    } as any);
    render(<IngredientsList />);

    expect(screen.getByText("Pantry")).toBeInTheDocument();
    expect(screen.getByText("Dairy")).toBeInTheDocument();
    expect(screen.getByText("Protein")).toBeInTheDocument();
  });

  it("renders ingredient names and quantities", () => {
    useRecipeMock.mockReturnValue({
      recipe: { ingredients: mockIngredients },
    } as any);
    render(<IngredientsList />);

    expect(screen.getByText("flour")).toBeInTheDocument();
    expect(screen.getByText("sugar")).toBeInTheDocument();
    expect(screen.getByText("2 cups")).toBeInTheDocument();
    expect(screen.getByText("1 cup")).toBeInTheDocument();
  });
});
