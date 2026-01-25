import { beforeEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubstituteIngredient } from "./substitute-ingredient";
import type { Ingredient } from "@/types/recipe";

const appendMessage = vi.fn();
const useCopilotChatMock = vi.fn();

vi.mock("@copilotkit/react-core", () => ({
  useCopilotChat: (...args: unknown[]) => useCopilotChatMock(...args),
}));

const ingredient: Ingredient = {
  name: "Tomatoes",
  quantity: 2,
  unit: "cups",
  preparation: "diced",
  category: "produce",
  substitutes: [],
};

describe("SubstituteIngredient", () => {
  beforeEach(() => {
    appendMessage.mockReset();
    useCopilotChatMock.mockReturnValue({
      appendMessage,
      isLoading: false,
    });
  });

  it("renders swap source details", () => {
    render(
      <SubstituteIngredient
        ingredient={ingredient}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText(/swapping:/i)).toBeInTheDocument();
    expect(screen.getByText("2 cups Tomatoes (diced)")).toBeInTheDocument();
  });

  it("calls onSubmit with trimmed input", async () => {
    const user = userEvent.setup();
    appendMessage.mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <SubstituteIngredient
        ingredient={ingredient}
        onClose={onClose}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(/leave blank/i),
      "  roasted peppers  ",
    );
    await user.click(screen.getByRole("button", { name: /substitute/i }));

    await waitFor(() => {
      expect(appendMessage).toHaveBeenCalledTimes(1);
    });
    const message = appendMessage.mock.calls[0]?.[0] as { content?: string };
    expect(message?.content).toBe(
      "Substitute Tomatoes with roasted peppers.",
    );
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("shows loading state", () => {
    useCopilotChatMock.mockReturnValue({
      appendMessage,
      isLoading: true,
    });

    render(
      <SubstituteIngredient
        ingredient={ingredient}
        onClose={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: /swapping/i })).toBeDisabled();
  });

  it("does not close on submit error", async () => {
    const user = userEvent.setup();
    appendMessage.mockRejectedValue(new Error("Swap failed"));
    const onClose = vi.fn();

    render(
      <SubstituteIngredient
        ingredient={ingredient}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: /substitute/i }));
    await waitFor(() => {
      expect(appendMessage).toHaveBeenCalledTimes(1);
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});
