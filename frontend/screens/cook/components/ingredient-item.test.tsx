import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IngredientItem } from "./ingredient-item";
import type { Ingredient } from "@/types/recipe";

const baseIngredient: Ingredient = {
  name: "Tomatoes",
  quantity: 2,
  unit: "cups",
  preparation: "diced",
  category: "produce",
  substitutes: [],
};

describe("IngredientItem", () => {
  it("renders name and quantity/unit", () => {
    render(<IngredientItem ingredient={baseIngredient} onSelect={() => {}} />);

    expect(screen.getByText("Tomatoes")).toBeInTheDocument();
    expect(screen.getByText("2 cups")).toBeInTheDocument();
  });

  it("renders preparation when provided", () => {
    render(<IngredientItem ingredient={baseIngredient} onSelect={() => {}} />);

    expect(screen.getByText("diced")).toBeInTheDocument();
  });

  it("calls onSelect when tapped", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<IngredientItem ingredient={baseIngredient} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: /tomatoes/i }));
    expect(onSelect).toHaveBeenCalledWith(baseIngredient);
  });

  it("omits quantity/unit when missing", () => {
    const ingredient: Ingredient = {
      ...baseIngredient,
      quantity: null,
      unit: null,
    };

    render(<IngredientItem ingredient={ingredient} onSelect={() => {}} />);

    expect(screen.queryByText(/cups/i)).not.toBeInTheDocument();
  });
});
