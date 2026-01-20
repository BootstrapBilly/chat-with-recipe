import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepCard } from "./step-card";
import { baseStep } from "@/fixtures/recipe-step";
import type { RecipeStep } from "@/types/recipe";

describe("StepCard", () => {
  it("renders step number and instruction", () => {
    render(<StepCard step={baseStep} isActive={false} isComplete={false} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Mix the ingredients")).toBeInTheDocument();
  });

  it("renders duration when provided", () => {
    const step: RecipeStep = { ...baseStep, duration_minutes: 10 };

    render(<StepCard step={step} isActive={false} isComplete={false} />);

    expect(screen.getByText("10 min")).toBeInTheDocument();
  });

  it("renders attention warning when required", () => {
    const step: RecipeStep = { ...baseStep, requires_attention: true };

    render(<StepCard step={step} isActive={false} isComplete={false} />);

    expect(screen.getByText("Watch closely")).toBeInTheDocument();
  });

  it("shows tips when button is clicked", async () => {
    const step: RecipeStep = { ...baseStep, tips: ["Tip one", "Tip two"] };

    render(<StepCard step={step} isActive={false} isComplete={false} />);

    expect(screen.queryByText("Tip one")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("2 tips"));

    expect(screen.getByText("Tip one")).toBeInTheDocument();
    expect(screen.getByText("Tip two")).toBeInTheDocument();
  });

  it("applies active styles when isActive", () => {
    const { container } = render(
      <StepCard step={baseStep} isActive={true} isComplete={false} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-accent");
  });

  it("applies complete styles when isComplete", () => {
    const { container } = render(
      <StepCard step={baseStep} isActive={false} isComplete={true} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("opacity-60");
  });
});
