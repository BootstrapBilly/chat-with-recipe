import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DesktopLayout } from "./layout";
import { baseRecipe } from "@/fixtures/recipe";
import { useRecipe } from "@/hooks/use-recipe";

vi.mock("@copilotkit/react-ui", () => ({
  CopilotChat: () => <div data-testid="copilot-chat">Chat</div>,
}));

vi.mock("@/hooks/use-recipe", () => ({
  useRecipe: vi.fn(),
}));

const useRecipeMock = vi.mocked(useRecipe);

function mockRecipeState(overrides?: Partial<ReturnType<typeof useRecipe>>) {
  useRecipeMock.mockReturnValue({
    recipe: baseRecipe,
    currentStep: 0,
    totalSteps: baseRecipe.steps.length,
    isComplete: false,
    threadId: "thread-1",
    onNextStep: vi.fn(),
    onFileSelect: vi.fn(),
    isUploading: false,
    error: null,
    ...overrides,
  } as never);
}

describe("DesktopLayout", () => {
  beforeEach(() => {
    useRecipeMock.mockReset();
  });

  it("renders upload screen when no recipe", () => {
    mockRecipeState({ recipe: null });
    render(<DesktopLayout />);

    expect(
      screen.getByText("Upload a recipe to get started"),
    ).toBeInTheDocument();
  });

  it("renders ingredients, chat, and steps when recipe is present", () => {
    mockRecipeState({ recipe: baseRecipe });
    render(<DesktopLayout />);

    expect(screen.getByText("Ingredients")).toBeInTheDocument();
    expect(screen.getByTestId("copilot-chat")).toBeInTheDocument();
    expect(screen.getByText("Steps")).toBeInTheDocument();
  });
});
