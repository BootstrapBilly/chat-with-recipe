import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UploadScreen } from "./upload-screen";

describe("UploadScreen", () => {
  it("renders title and subtitle", () => {
    render(<UploadScreen onFileSelect={vi.fn()} isUploading={false} />);

    expect(screen.getByText("Recipe Companion")).toBeInTheDocument();
    expect(screen.getByText("Upload a recipe to get started")).toBeInTheDocument();
  });

  it("renders FileUpload component", () => {
    render(<UploadScreen onFileSelect={vi.fn()} isUploading={false} />);

    expect(screen.getByText("Drop a recipe file here")).toBeInTheDocument();
  });

  it("displays error message when provided", () => {
    render(
      <UploadScreen
        onFileSelect={vi.fn()}
        isUploading={false}
        error="Upload failed"
      />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getAllByText("Upload failed")).toHaveLength(2);
  });

  it("does not display error when null", () => {
    render(
      <UploadScreen
        onFileSelect={vi.fn()}
        isUploading={false}
        error={null}
      />
    );

    expect(screen.queryByText("Upload failed")).not.toBeInTheDocument();
  });

  it("passes isUploading to FileUpload", () => {
    render(
      <UploadScreen
        onFileSelect={vi.fn()}
        isUploading={true}
      />
    );

    expect(screen.getByText(/Uploading/)).toBeInTheDocument();
  });
});
