import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecipeChat } from "./chat";

vi.mock("@copilotkit/react-ui", () => ({
  CopilotChat: ({ labels }: { labels: { initial: string } }) => (
    <div data-testid="copilot-chat">{labels.initial}</div>
  ),
}));

describe("RecipeChat", () => {
  it("renders CopilotChat component", () => {
    render(<RecipeChat threadId="thread-123" recipeTitle="Pancakes" />);

    expect(screen.getByTestId("copilot-chat")).toBeInTheDocument();
  });

  it("displays initial message with recipe title", () => {
    render(<RecipeChat threadId="thread-123" recipeTitle="Chocolate Cake" />);

    expect(
      screen.getByText(/Ask me anything about "Chocolate Cake"/)
    ).toBeInTheDocument();
  });

  it("handles null threadId", () => {
    render(<RecipeChat threadId={null} recipeTitle="Pasta" />);

    expect(screen.getByTestId("copilot-chat")).toBeInTheDocument();
  });
});
