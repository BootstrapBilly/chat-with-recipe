import type { Ingredient } from "@/types/recipe";

export const mockIngredients: Ingredient[] = [
  {
    name: "flour",
    quantity: 2,
    unit: "cups",
    category: "pantry",
    preparation: null,
    substitutes: [],
  },
  {
    name: "sugar",
    quantity: 1,
    unit: "cup",
    category: "pantry",
    preparation: null,
    substitutes: [],
  },
  {
    name: "eggs",
    quantity: 2,
    unit: null,
    category: "dairy",
    preparation: "beaten",
    substitutes: [],
  },
  {
    name: "chicken",
    quantity: 500,
    unit: "g",
    category: "protein",
    preparation: "diced",
    substitutes: [],
  },
];
