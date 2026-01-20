import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScaleServings } from "./scale-servings";
import { useRecipe } from "@/hooks/use-recipe";

const appendMessage = vi.fn();

vi.mock("@copilotkit/react-core", () => ({
  useCopilotChat: () => ({
    appendMessage,
    isLoading: false,
  }),
}));

vi.mock("@/hooks/use-recipe", () => ({
  useRecipe: vi.fn(),
}));

const useRecipeMock = vi.mocked(useRecipe);

describe("ScaleServings", () => {
  beforeEach(() => {
    appendMessage.mockClear();
    useRecipeMock.mockReset();
  });

  it("renders the servings button", () => {
    useRecipeMock.mockReturnValue({ recipe: { servings: 2 } } as any);
    render(<ScaleServings />);

    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
  });

  it("opens the dialog and shows current servings", async () => {
    const user = userEvent.setup();
    useRecipeMock.mockReturnValue({ recipe: { servings: 3 } } as any);
    render(<ScaleServings />);

    await user.click(screen.getByRole("button", { name: "3" }));

    expect(
      screen.getByRole("heading", { name: "Adjust servings" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(3);
  });

  it("increments and decrements with a min of 1", async () => {
    const user = userEvent.setup();
    useRecipeMock.mockReturnValue({ recipe: { servings: 1 } } as any);
    render(<ScaleServings />);

    await user.click(screen.getByRole("button", { name: "1" }));

    const input = screen.getByRole("spinbutton");
    const increment = screen.getByLabelText("Increase servings");
    const decrement = screen.getByLabelText("Decrease servings");

    await user.click(increment);
    expect(input).toHaveValue(2);

    await user.click(decrement);
    expect(input).toHaveValue(1);

    await user.click(decrement);
    expect(input).toHaveValue(1);
  });

  it("sends a scale message when submitting a new value", async () => {
    const user = userEvent.setup();
    useRecipeMock.mockReturnValue({ recipe: { servings: 2 } } as any);
    render(<ScaleServings />);

    await user.click(screen.getByRole("button", { name: "2" }));

    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "4");

    await user.click(
      screen.getByRole("button", { name: "Update servings" }),
    );

    expect(appendMessage).toHaveBeenCalledTimes(1);
    const message = appendMessage.mock.calls[0]?.[0];
    expect(message.content).toBe("Scale the recipe to 4 servings.");
  });
});
