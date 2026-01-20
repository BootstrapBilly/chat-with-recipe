import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Ingredients } from "./ingredients";
import { mockIngredients } from "@/fixtures/ingredients";
import { useRecipe } from "@/hooks/use-recipe";
import type { Recipe } from "@/types/recipe";
import { makeRecipeStore } from "@/test/mock-recipe-store";

vi.mock("@/hooks/use-recipe", () => ({
  useRecipe: vi.fn(),
}));

const useRecipeMock = vi.mocked(useRecipe);

function mockRecipeState(ingredients = mockIngredients) {
  useRecipeMock.mockReturnValue({
    ...makeRecipeStore({
      recipe: { ingredients } as Recipe,
    }),
  });
}

describe("Ingredients", () => {
  beforeEach(() => {
    useRecipeMock.mockReset();
  });

  it("renders ingredients button", () => {
    mockRecipeState();
    render(<Ingredients />);

    expect(screen.getByRole("button", { name: /ingredients/i })).toBeInTheDocument();
  });

  it("opens drawer when button is clicked", async () => {
    mockRecipeState();
    render(<Ingredients />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByRole("heading", { name: "Ingredients" })).toBeInTheDocument();
  });

  it("displays item count", async () => {
    mockRecipeState();
    render(<Ingredients />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("4 items")).toBeInTheDocument();
  });

  it("displays ingredient names", async () => {
    mockRecipeState();
    render(<Ingredients />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("flour")).toBeInTheDocument();
    expect(screen.getByText("sugar")).toBeInTheDocument();
    expect(screen.getByText("eggs")).toBeInTheDocument();
    expect(screen.getByText("chicken")).toBeInTheDocument();
  });

  it("displays quantities", async () => {
    mockRecipeState();
    render(<Ingredients />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("2 cups")).toBeInTheDocument();
    expect(screen.getByText("1 cup")).toBeInTheDocument();
    expect(screen.getByText("500 g")).toBeInTheDocument();
  });

  it("displays preparation notes", async () => {
    mockRecipeState();
    render(<Ingredients />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("beaten")).toBeInTheDocument();
    expect(screen.getByText("diced")).toBeInTheDocument();
  });

  it("groups ingredients by category", async () => {
    mockRecipeState();
    render(<Ingredients />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("Pantry")).toBeInTheDocument();
    expect(screen.getByText("Dairy")).toBeInTheDocument();
    expect(screen.getByText("Protein")).toBeInTheDocument();
  });

  it("handles empty ingredients list", async () => {
    mockRecipeState([]);
    render(<Ingredients />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("0 items")).toBeInTheDocument();
  });
});
