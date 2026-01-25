import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepsPanel } from "./steps-panel";
import { baseStep } from "@/fixtures/recipe-step";
import { useRecipe } from "@/hooks/use-recipe";
import type { Recipe } from "@/types/recipe";
import { makeRecipeStore } from "@/test/mock-recipe-store";

vi.mock("@/hooks/use-recipe", () => ({
  useRecipe: vi.fn(),
}));

const useRecipeMock = vi.mocked(useRecipe);

describe("StepsPanel", () => {
  beforeEach(() => {
    useRecipeMock.mockReset();
  });

  it("renders header, count, and step cards", () => {
    const steps = [
      { ...baseStep, step_number: 1, instruction: "First step" },
      { ...baseStep, step_number: 2, instruction: "Second step" },
    ];

    useRecipeMock.mockReturnValue({
      ...makeRecipeStore({
        recipe: { steps } as Recipe,
        totalSteps: 2,
      }),
    });

    render(<StepsPanel />);

    expect(screen.getByText("Steps")).toBeInTheDocument();
    expect(screen.getByText("2 steps")).toBeInTheDocument();
    expect(screen.getByText("First step")).toBeInTheDocument();
    expect(screen.getByText("Second step")).toBeInTheDocument();
  });

  it("renders next button", () => {
    useRecipeMock.mockReturnValue({
      ...makeRecipeStore({
        recipe: { steps: [baseStep] } as Recipe,
        totalSteps: 1,
        isComplete: false,
      }),
    });

    render(<StepsPanel />);

    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("renders finished button when complete", () => {
    useRecipeMock.mockReturnValue({
      ...makeRecipeStore({
        recipe: { steps: [baseStep] } as Recipe,
        totalSteps: 1,
        isComplete: true,
      }),
    });

    render(<StepsPanel />);

    expect(
      screen.getByRole("button", { name: /finished/i }),
    ).toBeInTheDocument();
  });
});
