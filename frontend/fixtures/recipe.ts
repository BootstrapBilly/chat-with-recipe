import type { Recipe } from "@/types/recipe";
import { baseStep } from "./recipe-step";

export const baseRecipe: Recipe = {
  title: "Test Recipe",
  description: null,
  servings: 4,
  original_servings: null,
  prep_time_minutes: 15,
  cook_time_minutes: 30,
  difficulty: "medium",
  cuisine: null,
  dietary_tags: [],
  ingredients: [],
  steps: [],
  source_text: null,
};

export const recipeWithSteps: Recipe = {
  ...baseRecipe,
  title: "Pancakes",
  ingredients: [
    {
      name: "flour",
      quantity: 2,
      unit: "cups",
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
  ],
  steps: [
    { ...baseStep, step_number: 1, instruction: "Mix dry ingredients" },
    { ...baseStep, step_number: 2, instruction: "Add wet ingredients" },
  ],
};
