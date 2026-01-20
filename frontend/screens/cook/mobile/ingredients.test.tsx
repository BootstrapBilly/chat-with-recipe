import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Ingredients } from "./ingredients";
import { mockIngredients } from "@/fixtures/ingredients";

describe("Ingredients", () => {
  it("renders ingredients button", () => {
    render(<Ingredients ingredients={mockIngredients} />);

    expect(screen.getByRole("button", { name: /ingredients/i })).toBeInTheDocument();
  });

  it("opens drawer when button is clicked", async () => {
    render(<Ingredients ingredients={mockIngredients} />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByRole("heading", { name: "Ingredients" })).toBeInTheDocument();
  });

  it("displays item count", async () => {
    render(<Ingredients ingredients={mockIngredients} />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("4 items")).toBeInTheDocument();
  });

  it("displays ingredient names", async () => {
    render(<Ingredients ingredients={mockIngredients} />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("flour")).toBeInTheDocument();
    expect(screen.getByText("sugar")).toBeInTheDocument();
    expect(screen.getByText("eggs")).toBeInTheDocument();
    expect(screen.getByText("chicken")).toBeInTheDocument();
  });

  it("displays quantities", async () => {
    render(<Ingredients ingredients={mockIngredients} />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("2 cups")).toBeInTheDocument();
    expect(screen.getByText("1 cup")).toBeInTheDocument();
    expect(screen.getByText("500 g")).toBeInTheDocument();
  });

  it("displays preparation notes", async () => {
    render(<Ingredients ingredients={mockIngredients} />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("beaten")).toBeInTheDocument();
    expect(screen.getByText("diced")).toBeInTheDocument();
  });

  it("groups ingredients by category", async () => {
    render(<Ingredients ingredients={mockIngredients} />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("Pantry")).toBeInTheDocument();
    expect(screen.getByText("Dairy")).toBeInTheDocument();
    expect(screen.getByText("Protein")).toBeInTheDocument();
  });

  it("handles empty ingredients list", async () => {
    render(<Ingredients ingredients={[]} />);

    await userEvent.click(screen.getByRole("button", { name: /ingredients/i }));

    expect(screen.getByText("0 items")).toBeInTheDocument();
  });
});
