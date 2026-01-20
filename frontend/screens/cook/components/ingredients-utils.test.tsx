import { describe, it, expect } from "vitest";
import { groupIngredientsByCategory } from "./ingredients-utils";
import { mockIngredients } from "@/fixtures/ingredients";

describe("ingredients-utils", () => {
  it("groups ingredients by category", () => {
    const grouped = groupIngredientsByCategory(mockIngredients);

    expect(grouped.pantry).toHaveLength(2);
    expect(grouped.dairy).toHaveLength(1);
    expect(grouped.protein).toHaveLength(1);
  });

  it("omits empty categories", () => {
    const grouped = groupIngredientsByCategory([]);

    expect(Object.keys(grouped)).toHaveLength(0);
  });
});
