import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileLayout } from "./layout";
import { recipeWithSteps } from "@/fixtures/recipe";
import { useRecipe } from "@/hooks/use-recipe";

const onNextStep = vi.fn();

vi.mock("@/hooks/use-recipe", () => ({
  useRecipe: vi.fn(),
}));

const useRecipeMock = vi.mocked(useRecipe);

function mockRecipeState(
  overrides?: Partial<ReturnType<typeof useRecipe>>,
) {
  useRecipeMock.mockReturnValue({
    recipeContext: null,
    recipe: recipeWithSteps,
    currentStep: 0,
    totalSteps: recipeWithSteps.steps.length,
    isComplete: false,
    threadId: null,
    onNextStep,
    onFileSelect: vi.fn(),
    isUploading: false,
    error: null,
    ...overrides,
  });
}

vi.mock("@copilotkit/react-ui", () => ({
  CopilotChat: () => <div data-testid="copilot-chat">Chat</div>,
}));

describe("MobileLayout", () => {
  beforeEach(() => {
    useRecipeMock.mockReset();
  });

  it("renders recipe title in header", () => {
    mockRecipeState();
    render(<MobileLayout />);

    expect(screen.getByText("Pancakes")).toBeInTheDocument();
  });

  it("renders all steps", () => {
    mockRecipeState();
    render(<MobileLayout />);

    expect(screen.getByText("Mix dry ingredients")).toBeInTheDocument();
    expect(screen.getByText("Add wet ingredients")).toBeInTheDocument();
  });

  it("shows Next button on first step", () => {
    mockRecipeState({ currentStep: 1, isComplete: false });
    render(<MobileLayout />);

    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("shows Finished when recipe is complete", () => {
    mockRecipeState({ currentStep: 2, isComplete: true });
    render(<MobileLayout />);

    expect(
      screen.getByRole("button", { name: /finished/i }),
    ).toBeInTheDocument();
  });

  it("calls onNextStep when button is clicked", async () => {
    onNextStep.mockClear();
    mockRecipeState({ currentStep: 1, isComplete: false });
    render(<MobileLayout />);

    await userEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(onNextStep).toHaveBeenCalledOnce();
  });

  it("renders servings in bottom bar", () => {
    mockRecipeState();
    render(<MobileLayout />);

    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("opens ingredients drawer when ingredients button is clicked", async () => {
    mockRecipeState();
    render(<MobileLayout />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByRole("heading", { name: "Ingredients" })).toBeInTheDocument();
  });

  it("displays ingredients in drawer", async () => {
    mockRecipeState();
    render(<MobileLayout />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("flour")).toBeInTheDocument();
    expect(screen.getByText("2 cups")).toBeInTheDocument();
    expect(screen.getByText(/eggs/)).toBeInTheDocument();
  });
});
