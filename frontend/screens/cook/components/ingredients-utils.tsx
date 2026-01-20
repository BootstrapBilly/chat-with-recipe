"use client";

import type { Ingredient, IngredientCategory } from "@/types/recipe";

export const CATEGORY_ORDER: IngredientCategory[] = [
  "produce",
  "protein",
  "dairy",
  "pantry",
  "spice",
  "other",
];

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  produce: "Produce",
  protein: "Protein",
  dairy: "Dairy",
  pantry: "Pantry",
  spice: "Spices",
  other: "Other",
};

export function groupIngredientsByCategory(
  ingredients: Ingredient[],
): Record<IngredientCategory, Ingredient[]> {
  return CATEGORY_ORDER.reduce(
    (acc, category) => {
      const items = ingredients.filter((ing) => ing.category === category);
      if (items.length > 0) acc[category] = items;
      return acc;
    },
    {} as Record<IngredientCategory, Ingredient[]>,
  );
}
