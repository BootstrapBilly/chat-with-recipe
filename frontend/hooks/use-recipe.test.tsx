import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecipeProvider, useRecipe } from "./use-recipe";
import { recipeWithSteps } from "@/fixtures/recipe";
import type { RecipeContext } from "@/types/recipe";

const mutate = vi.fn();
const sendMessage = vi.fn();

vi.mock("@/hooks/use-upload-recipe", () => ({
  useUploadRecipe: () => ({
    mutate,
    isPending: false,
    error: null,
  }),
}));

vi.mock("@copilotkit/react-core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@copilotkit/react-core")>();
  return {
    ...actual,
    useCopilotChatInternal: () => ({
      sendMessage,
    }),
    useCopilotContext: () => ({
      setThreadId: vi.fn(),
    }),
    useCoAgent: () => ({
      state: {},
      setState: vi.fn(),
      running: false,
    }),
    useCopilotReadable: () => {},
  };
});

function RecipeProbe() {
  const { recipe, currentStep, onFileSelect, onNextStep } = useRecipe();
  return (
    <div>
      <div data-testid="recipe-title">{recipe?.title ?? "none"}</div>
      <div data-testid="current-step">{currentStep}</div>
      <button onClick={() => onFileSelect(new File(["x"], "recipe.txt"))}>
        upload
      </button>
      <button onClick={onNextStep}>next</button>
    </div>
  );
}

describe("useRecipe", () => {
  beforeEach(() => {
    mutate.mockReset();
    sendMessage.mockReset();
  });

  it("throws if used without provider", () => {
    const renderWithoutProvider = () => render(<RecipeProbe />);

    expect(renderWithoutProvider).toThrow(
      "useRecipe must be used within RecipeProvider",
    );
  });

  it("updates recipe after upload and sends next step message", async () => {
    const user = userEvent.setup();
    const state: RecipeContext = {
      document_text: null,
      recipe: recipeWithSteps,
      current_step: 0,
      scaled_servings: null,
      checked_ingredients: [],
      cooking_started: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutate.mockImplementation((_file: File, options?: any) => {
      options?.onSuccess?.({
        threadId: "thread-1",
        runId: "run-1",
        state,
      });
    });

    render(
      <RecipeProvider>
        <RecipeProbe />
      </RecipeProvider>,
    );

    expect(screen.getByTestId("recipe-title")).toHaveTextContent("none");

    await user.click(screen.getByRole("button", { name: /upload/i }));

    expect(screen.getByTestId("recipe-title")).toHaveTextContent("Pancakes");
    expect(screen.getByTestId("current-step")).toHaveTextContent("1");

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(sendMessage).toHaveBeenCalledTimes(1);
  });
});
