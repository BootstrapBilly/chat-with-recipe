import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./header";
import { baseRecipe } from "@/fixtures/recipe";

describe("Header", () => {
  it("renders recipe title", () => {
    render(<Header recipe={baseRecipe} currentStep={0} totalSteps={5} />);

    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
  });

  it("renders prep time", () => {
    render(<Header recipe={baseRecipe} currentStep={0} totalSteps={5} />);

    expect(screen.getByText("15m prep")).toBeInTheDocument();
  });

  it("renders cook time", () => {
    render(<Header recipe={baseRecipe} currentStep={0} totalSteps={5} />);

    expect(screen.getByText("30m cook")).toBeInTheDocument();
  });

  it("renders difficulty", () => {
    render(<Header recipe={baseRecipe} currentStep={0} totalSteps={5} />);

    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("renders Unknown fallbacks", () => {
    render(
      <Header
        recipe={{
          ...baseRecipe,
          prep_time_minutes: null,
          cook_time_minutes: null,
          difficulty: null as never,
        }}
        currentStep={0}
        totalSteps={5}
      />,
    );

    expect(screen.getByText("Unknown prep")).toBeInTheDocument();
    expect(screen.getByText("Unknown cook")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
