import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IngredientsPanel } from "./ingredients-panel";
import { mockIngredients } from "@/fixtures/ingredients";

describe("IngredientsPanel", () => {
  it("renders header, count, and list items", () => {
    render(<IngredientsPanel ingredients={mockIngredients} servings={4} />);

    expect(screen.getByText("Ingredients")).toBeInTheDocument();
    expect(screen.getByText("4 items")).toBeInTheDocument();
    expect(screen.getByText("flour")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
  });
});
