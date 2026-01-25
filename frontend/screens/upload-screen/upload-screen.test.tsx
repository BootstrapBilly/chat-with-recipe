import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UploadScreen } from "./upload-screen";

const mutate = vi.fn();
const setRecipeContext = vi.fn();

vi.mock("@/hooks/use-recipe", () => ({
  useRecipe: () => ({
    setRecipeContext,
  }),
}));

vi.mock("@/hooks/use-upload-recipe", () => ({
  useUploadRecipe: () => ({
    mutate,
    isPending: false,
    error: null,
  }),
}));

describe("UploadScreen", () => {
  beforeEach(() => {
    mutate.mockReset();
    setRecipeContext.mockReset();
  });

  it("renders title and subtitle", () => {
    render(<UploadScreen />);

    expect(screen.getByText("Recipe Companion")).toBeInTheDocument();
    expect(screen.getByText("Upload a recipe to get started")).toBeInTheDocument();
  });

  it("renders FileUpload component", () => {
    render(<UploadScreen />);

    expect(screen.getByText("Drop a recipe file here")).toBeInTheDocument();
  });

  it("calls setRecipeContext on successful upload", async () => {
    const user = userEvent.setup();
    const mockState = { recipe: { title: "Test" } };

    mutate.mockImplementation((_file: File, options?: { onSuccess?: (data: unknown) => void }) => {
      options?.onSuccess?.({ state: mockState });
    });

    render(<UploadScreen />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["test"], "recipe.pdf", { type: "application/pdf" });

    await user.upload(input, file);

    expect(mutate).toHaveBeenCalled();
    expect(setRecipeContext).toHaveBeenCalledWith(mockState);
  });

  it("shows error on upload failure", async () => {
    const user = userEvent.setup();

    mutate.mockImplementation((_file: File, options?: { onError?: () => void }) => {
      options?.onError?.();
    });

    render(<UploadScreen />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["test"], "recipe.pdf", { type: "application/pdf" });

    await user.upload(input, file);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("We could not upload that document.")).toBeInTheDocument();
  });
});
