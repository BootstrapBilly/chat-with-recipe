import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IngredientsList } from "./ingredients-list";
import { mockIngredients } from "@/fixtures/ingredients";

describe("IngredientsList", () => {
  it("renders grouped ingredient categories", () => {
    render(<IngredientsList ingredients={mockIngredients} />);

    expect(screen.getByText("Pantry")).toBeInTheDocument();
    expect(screen.getByText("Dairy")).toBeInTheDocument();
    expect(screen.getByText("Protein")).toBeInTheDocument();
  });

  it("renders ingredient names and quantities", () => {
    render(<IngredientsList ingredients={mockIngredients} />);

    expect(screen.getByText("flour")).toBeInTheDocument();
    expect(screen.getByText("sugar")).toBeInTheDocument();
    expect(screen.getByText("2 cups")).toBeInTheDocument();
    expect(screen.getByText("1 cup")).toBeInTheDocument();
  });
});
