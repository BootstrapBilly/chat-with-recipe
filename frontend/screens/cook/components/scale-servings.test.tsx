import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScaleServings } from "./scale-servings";
import { useRecipe } from "@/hooks/use-recipe";
import type { Recipe } from "@/types/recipe";
import { makeRecipeStore } from "@/test/mock-recipe-store";

vi.mock("@/hooks/use-recipe", () => ({
  useRecipe: vi.fn(),
}));

const useRecipeMock = vi.mocked(useRecipe);

describe("ScaleServings", () => {
  beforeEach(() => {
    useRecipeMock.mockReset();
  });

  it("renders the servings control", () => {
    useRecipeMock.mockReturnValue({
      ...makeRecipeStore({
        recipe: { servings: 2 } as Recipe,
        scaleServings: vi.fn(),
      }),
    });
    render(<ScaleServings />);

    expect(screen.getByText("Servings")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(2);
  });

  it("increments and decrements servings", async () => {
    const user = userEvent.setup();
    const scaleServings = vi.fn();
    useRecipeMock.mockReturnValue({
      ...makeRecipeStore({
        recipe: { servings: 3 } as Recipe,
        scaleServings,
      }),
    });
    render(<ScaleServings />);

    await user.click(screen.getByLabelText("Increase servings"));
    expect(scaleServings).toHaveBeenCalledWith(4);

    await user.click(screen.getByLabelText("Decrease servings"));
    expect(scaleServings).toHaveBeenCalledWith(2);
  });

  it("prevents decrementing below 1", async () => {
    const user = userEvent.setup();
    const scaleServings = vi.fn();
    useRecipeMock.mockReturnValue({
      ...makeRecipeStore({
        recipe: { servings: 1 } as Recipe,
        scaleServings,
      }),
    });
    render(<ScaleServings />);

    const decrement = screen.getByLabelText("Decrease servings");

    await user.click(decrement);
    expect(scaleServings).not.toHaveBeenCalled();
  });

  it("commits typed servings on change", async () => {
    const user = userEvent.setup();
    const scaleServings = vi.fn();
    useRecipeMock.mockReturnValue({
      ...makeRecipeStore({
        recipe: { servings: 2 } as Recipe,
        scaleServings,
      }),
    });
    render(<ScaleServings />);

    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "4");
    expect(scaleServings).toHaveBeenCalledWith(4);
  });
});
