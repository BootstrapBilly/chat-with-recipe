import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "./file-upload";

describe("FileUpload", () => {
  it("renders default empty state", () => {
    render(<FileUpload onFileSelect={vi.fn()} />);

    expect(screen.getByText("Drop a recipe file here")).toBeInTheDocument();
    expect(screen.getByText("PDF or TXT")).toBeInTheDocument();
  });

  it("renders uploading state", () => {
    render(
      <FileUpload
        onFileSelect={vi.fn()}
        isUploading={true}
        fileName="recipe.pdf"
      />
    );

    expect(screen.getByText("Uploading recipe.pdf...")).toBeInTheDocument();
  });

  it("renders with fileName when not uploading", () => {
    render(
      <FileUpload
        onFileSelect={vi.fn()}
        isUploading={false}
        fileName="recipe.pdf"
      />
    );

    expect(screen.getByText("recipe.pdf")).toBeInTheDocument();
  });

  it("calls onFileSelect when valid file is dropped", async () => {
    const onFileSelect = vi.fn();
    render(<FileUpload onFileSelect={onFileSelect} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["recipe content"], "recipe.pdf", {
      type: "application/pdf",
    });

    await userEvent.upload(input, file);

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it("calls onError when invalid file is dropped", async () => {
    const onError = vi.fn();
    const { container } = render(<FileUpload onFileSelect={vi.fn()} onError={onError} />);

    const dropzone = container.firstChild as HTMLElement;
    const file = new File(["image"], "photo.jpg", { type: "image/jpeg" });

    const dataTransfer = {
      files: [file],
      items: [{ kind: "file", type: file.type, getAsFile: () => file }],
      types: ["Files"],
    };

    // Fire drop event directly since userEvent.upload doesn't trigger rejection
    const dropEvent = new Event("drop", { bubbles: true });
    Object.assign(dropEvent, { dataTransfer });

    await act(async () => {
      dropzone.dispatchEvent(dropEvent);
    });

    expect(onError).toHaveBeenCalledWith("Please upload a PDF or TXT file");
  });
});
