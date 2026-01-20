import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { SubstituteIngredient } from "./substitute-ingredient";
import type { Ingredient } from "@/types/recipe";

const ingredient: Ingredient = {
  name: "Tomatoes",
  quantity: 2,
  unit: "cups",
  preparation: "diced",
  category: "produce",
  substitutes: [],
};

describe("SubstituteIngredient", () => {
  it("renders swap source details", () => {
    render(
      <SubstituteIngredient
        ingredient={ingredient}
        open
        onOpenChange={() => {}}
        onSubmit={() => {}}
        value=""
        onValueChange={() => {}}
      />,
    );

    expect(screen.getByText(/swapping:/i)).toBeInTheDocument();
    expect(screen.getByText("2 cups Tomatoes (diced)")).toBeInTheDocument();
  });

  it("calls onSubmit with trimmed input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const Wrapper = () => {
      const [value, setValue] = React.useState("");
      return (
        <SubstituteIngredient
          ingredient={ingredient}
          open
          onOpenChange={() => {}}
          onSubmit={onSubmit}
          value={value}
          onValueChange={setValue}
        />
      );
    };

    render(<Wrapper />);

    await user.type(
      screen.getByPlaceholderText(/leave blank/i),
      "  roasted peppers  ",
    );
    await user.click(screen.getByRole("button", { name: /substitute/i }));

    expect(onSubmit).toHaveBeenCalledWith(ingredient, "roasted peppers");
  });

  it("shows loading state", () => {
    render(
      <SubstituteIngredient
        ingredient={ingredient}
        open
        onOpenChange={() => {}}
        onSubmit={() => {}}
        value=""
        onValueChange={() => {}}
        isLoading
      />,
    );

    expect(screen.getByRole("button", { name: /swapping/i })).toBeDisabled();
  });

  it("shows error message", () => {
    render(
      <SubstituteIngredient
        ingredient={ingredient}
        open
        onOpenChange={() => {}}
        onSubmit={() => {}}
        value=""
        onValueChange={() => {}}
        error="Swap failed"
      />,
    );

    expect(screen.getByText("Swap failed")).toBeInTheDocument();
  });
});
