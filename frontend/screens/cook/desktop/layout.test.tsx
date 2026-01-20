import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DesktopLayout } from "./layout";
import { baseRecipe } from "@/fixtures/recipe";

vi.mock("@copilotkit/react-ui", () => ({
  CopilotChat: () => <div data-testid="copilot-chat">Chat</div>,
}));

describe("DesktopLayout", () => {
  it("renders upload screen when no recipe", () => {
    render(
      <DesktopLayout
        recipe={null}
        currentStep={0}
        threadId={null}
        onNextStep={() => {}}
        uploadState={{
          onFileSelect: () => {},
          isUploading: false,
          error: null,
        }}
      />,
    );

    expect(
      screen.getByText("Upload a recipe to get started"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ingredients")).toBeInTheDocument();
    expect(screen.getByText("Steps")).toBeInTheDocument();
  });

  it("renders ingredients, chat, and steps when recipe is present", () => {
    render(
      <DesktopLayout
        recipe={baseRecipe}
        currentStep={0}
        threadId="thread-1"
        onNextStep={vi.fn()}
        uploadState={{
          onFileSelect: () => {},
          isUploading: false,
          error: null,
        }}
      />,
    );

    expect(screen.getByText("Ingredients")).toBeInTheDocument();
    expect(screen.getByTestId("copilot-chat")).toBeInTheDocument();
    expect(screen.getByText("Steps")).toBeInTheDocument();
  });
});
