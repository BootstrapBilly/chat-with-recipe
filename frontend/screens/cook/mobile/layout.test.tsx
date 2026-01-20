import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileLayout } from "./layout";
import { recipeWithSteps } from "@/fixtures/recipe";

vi.mock("@copilotkit/react-ui", () => ({
  CopilotChat: () => <div data-testid="copilot-chat">Chat</div>,
}));

describe("MobileLayout", () => {
  it("renders recipe title in header", () => {
    render(
      <MobileLayout
        recipe={recipeWithSteps}
        currentStep={0}
        threadId={null}
        onNextStep={vi.fn()}
      />
    );

    expect(screen.getByText("Pancakes")).toBeInTheDocument();
  });

  it("renders all steps", () => {
    render(
      <MobileLayout
        recipe={recipeWithSteps}
        currentStep={0}
        threadId={null}
        onNextStep={vi.fn()}
      />
    );

    expect(screen.getByText("Mix dry ingredients")).toBeInTheDocument();
    expect(screen.getByText("Add wet ingredients")).toBeInTheDocument();
  });

  it("shows Start button when currentStep is 0", () => {
    render(
      <MobileLayout
        recipe={recipeWithSteps}
        currentStep={0}
        threadId={null}
        onNextStep={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  });

  it("shows Next button when cooking has started", () => {
    render(
      <MobileLayout
        recipe={recipeWithSteps}
        currentStep={1}
        threadId={null}
        onNextStep={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("shows Done when recipe is complete", () => {
    render(
      <MobileLayout
        recipe={recipeWithSteps}
        currentStep={2}
        threadId={null}
        onNextStep={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /done/i })).toBeInTheDocument();
  });

  it("calls onNextStep when button is clicked", async () => {
    const onNextStep = vi.fn();

    render(
      <MobileLayout
        recipe={recipeWithSteps}
        currentStep={0}
        threadId={null}
        onNextStep={onNextStep}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /start/i }));

    expect(onNextStep).toHaveBeenCalledOnce();
  });

  it("renders servings in bottom bar", () => {
    render(
      <MobileLayout
        recipe={recipeWithSteps}
        currentStep={0}
        threadId={null}
        onNextStep={vi.fn()}
      />
    );

    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("opens ingredients drawer when ingredients button is clicked", async () => {
    render(
      <MobileLayout
        recipe={recipeWithSteps}
        currentStep={0}
        threadId={null}
        onNextStep={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByRole("heading", { name: "Ingredients" })).toBeInTheDocument();
  });

  it("displays ingredients in drawer", async () => {
    render(
      <MobileLayout
        recipe={recipeWithSteps}
        currentStep={0}
        threadId={null}
        onNextStep={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("flour")).toBeInTheDocument();
    expect(screen.getByText("2 cups")).toBeInTheDocument();
    expect(screen.getByText(/eggs/)).toBeInTheDocument();
  });
});
