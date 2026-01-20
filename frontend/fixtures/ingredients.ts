import type { Ingredient } from "@/types/recipe";

export const mockIngredients: Partial<Ingredient>[] = [
  {
    name: "flour",
    quantity: 2,
    unit: "cups",
    category: "pantry",
    preparation: null,
  },
  {
    name: "sugar",
    quantity: 1,
    unit: "cup",
    category: "pantry",
    preparation: null,
  },
  {
    name: "eggs",
    quantity: 2,
    unit: null,
    category: "dairy",
    preparation: "beaten",
  },
  {
    name: "chicken",
    quantity: 500,
    unit: "g",
    category: "protein",
    preparation: "diced",
  },
];
