import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepCard } from "./step-card";
import { baseStep } from "@/fixtures/recipe-step";

describe("StepCard", () => {
  it("renders step number and instruction", () => {
    render(<StepCard step={baseStep} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Mix the ingredients")).toBeInTheDocument();
  });

  it("applies active styles when isActive", () => {
    const { container } = render(<StepCard step={baseStep} isActive />);

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-accent");
  });

  it("applies complete styles when isComplete", () => {
    const { container } = render(<StepCard step={baseStep} isComplete />);

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("opacity-60");
  });
});
