import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecipeHeader } from "./recipe-header";
import { baseRecipe } from "@/fixtures/recipe";

describe("RecipeHeader", () => {
  it("renders mobile header content", () => {
    render(<RecipeHeader recipe={baseRecipe} variant="mobile" />);

    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(screen.getByText("15m prep")).toBeInTheDocument();
    expect(screen.getByText("30m cook")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("renders desktop header content", () => {
    render(<RecipeHeader recipe={baseRecipe} variant="desktop" />);

    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(
      screen.getByText("15m prep • 30m cook • medium"),
    ).toBeInTheDocument();
  });

  it("renders Unknown fallbacks", () => {
    render(
      <RecipeHeader
        variant="mobile"
        recipe={{
          ...baseRecipe,
          prep_time_minutes: null,
          cook_time_minutes: null,
          difficulty: undefined as unknown as typeof baseRecipe.difficulty,
        }}
      />,
    );

    expect(screen.getByText("Unknown prep")).toBeInTheDocument();
    expect(screen.getByText("Unknown cook")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
